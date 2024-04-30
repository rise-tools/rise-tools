import { WebMidi as Midi } from "webmidi";

type MidiEvent =
  | {
      key: "bank";
      value: number;
    }
  | {
      key: "program";
      value: number;
    }
  | {
      key: "update";
      channel: number;
      value: number;
    };

const handlers = new Set<(e: MidiEvent) => void>();

export function subscribeMidiEvents(handler: (e: MidiEvent) => void) {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

function sendEvent(event: MidiEvent) {
  handlers.forEach((handler) => handler(event));
}

Midi.enable({ sysex: true })
  .then(onEnabled)
  .catch((err) => console.error(err));

function formatValue(v: number | boolean | undefined): string {
  if (v === undefined) return "undefined";
  if (typeof v === "boolean") return v ? "true" : "false";
  return v.toFixed(2);
}

function onEnabled() {
  //   const worlde = Midi.getInputByName("WORLDE MIDI 1");
  const worlde = Midi.inputs.find((input) => input.name.match("WORLDE"));

  if (!worlde) {
    console.error("No WORDLE MIDI input found.");
    return;
  }
  console.log("MIDI Input Connected");
  worlde.addListener("midimessage", (e) => {
    switch (e.message.type) {
      case "programchange":
      case "controlchange":
      case "sysex":
        return;
    }
    console.log("UnknownMidiMessage", e);
  });

  worlde.addListener("sysex", (e) => {
    const bank = e.message.dataBytes[7];
    if (bank === undefined) return;
    sendEvent({ key: "bank", value: bank + 1 });
  });

  // Heavy Knob
  worlde.addListener("programchange", (e) => {
    sendEvent({ key: "program", value: e.value as number });
  });

  worlde.addListener("controlchange", (e) => {
    sendEvent({ key: "update", channel: e.controller.number, value: e.value });
    // Chanel Number Map
    //                   1️⃣ 2️⃣  3️⃣ 4️⃣  5️⃣ 6️⃣  7️⃣ 8️⃣  🔽
    // 67   program  64  14  15  16  17  18  19  20  21  22 <- Knobs
    // 🅰️   change  🅱️   3   4   5   6   7   8   9  10  11 <- Sliders
    //      - 60 +       23  24  25  26  27  28  29  30  31 <- Buttons
    // Bank ????    1  2           49 47 48  46 45 44       <- Extra Buttons
    //                 WORLDE     🔁 ⏪ ⏩ ⏹️ ▶️ ⏺️ Easycontrol.9
  });

  // Outputs
  //   Midi.outputs.forEach((output) => {
  //     console.log("MIDI o:", output.manufacturer, "Name:", output.name);
  //   });
}
