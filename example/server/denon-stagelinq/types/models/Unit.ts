
type Unit = {
	[key: string]: {
		name: string,
		type: string,
		decks: number,
	}
}

export const Units: Unit = {
	JC11: { name: 'PRIME4', type: 'CONTROLLER', decks: 4 },
	JC16: { name: 'PRIME2', type: 'CONTROLLER', decks: 2 },
	JC20: { name: 'LC6000', type: 'OTHER', decks: 0 },
	JP07: { name: 'SC5000', type: 'PLAYER', decks: 2 },
	JP08: { name: 'SC5000M', type: 'PLAYER', decks: 2 },
	JP11: { name: 'PRIMEGO', type: 'CONTROLLER', decks: 2 },
	JP13: { name: 'SC6000', type: 'PLAYER', decks: 2 },
	JP14: { name: 'SC6000M', type: 'PLAYER', decks: 2 },
	JP20: { name: 'SCLIVE2', type: 'CONTROLLER', decks: 2 },
	JP21: { name: 'SCLIVE4', type: 'CONTROLLER', decks: 4 },
	NH08: { name: 'MIXSTREAMPRO', type: 'CONTROLLER', decks: 2 },
	NH09: { name: 'MIXSTREAMPROPLUS', type: 'CONTROLLER', decks: 2 },
	NH10: { name: 'MIXSTREAMPROGO', type: 'CONTROLLER', decks: 2 },
	JM08: { name: 'DN-X1800Prime', type: 'MIXER', decks: 0 },
	JM10: { name: 'DN-X1850Prime', type: 'MIXER', decks: 0 },
}
