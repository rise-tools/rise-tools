import { WebMidi as Midi } from "webmidi";

import ReconnectingWebSocket from "reconnecting-websocket";
import { TemplateEvent } from "@final-ui/react";

const wsUrl = "ws://localhost:3990";

const rws = new ReconnectingWebSocket(wsUrl);

function sendEvent(event: TemplateEvent) {
  rws.send(
    JSON.stringify({
      $: "evt",
      event,
    }),
  );
}

// sendEvent({});

Midi.enable({ sysex: true })
  .then(onEnabled)
  .catch((err) => console.error(err));

function formatValue(v: number | boolean | undefined): string {
  if (v === undefined) return "undefined";
  if (typeof v === "boolean") return v ? "true" : "false";
  return v.toFixed(2);
}

function onEnabled() {
  const worlde = Midi.getInputByName("WORLDE MIDI 1");

  if (!worlde) {
    console.error("No WORDLE MIDI input found.");
    return;
  }

  console.log(
    "MIDI i:",
    worlde.manufacturer,
    "Name:",
    worlde.name,
    "ID:",
    worlde.id,
  );

  worlde.addListener("midimessage", (e) => {
    switch (e.message.type) {
      case "programchange":
      case "controlchange":
      case "sysex":
        return;
    }
    // Other messages that we haven't seen yet?
    console.log(e);
  });

  worlde.addListener("sysex", (e) => {
    // console.log("sysex:", e)
    const bank = e.message.dataBytes[7];

    if (bank === undefined) return;

    console.log("Bank:", bank + 1);
  });

  // Heavy Knob
  worlde.addListener("programchange", (e) => {
    console.log("programchange:", e.value);
  });

  worlde.addListener("controlchange", (e) => {
    console.log("Midi:", e.controller.number, formatValue(e.value));
    // We know e.target is Input type...
    const target = e.target as MidiInput;
    // Controller Number Map
    //                   1️⃣ 2️⃣  3️⃣ 4️⃣  5️⃣ 6️⃣  7️⃣ 8️⃣  🔽
    // 67   program  64  14  15  16  17  18  19  20  21  22 <- Knobs
    // 🅰️   change  🅱️   3   4   5   6   7   8   9  10  11 <- Sliders
    //      - 60 +       23  24  25  26  27  28  29  30  31 <- Buttons
    // Bank ????    1  2           49 47 48  46 45 44       <- Extra Buttons
    //                 WORLDE     🔁 ⏪ ⏩ ⏹️ ▶️ ⏺️ Easycontrol.9
  });

  // Outputs
  Midi.outputs.forEach((output) => {
    console.log("MIDI o:", output.manufacturer, "Name:", output.name);
  });

  // Midi.getOutputByName("WORLDE MIDI 1").sendChannelAftertouch(false);
}
