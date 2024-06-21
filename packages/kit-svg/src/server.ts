import { createComponentDefinition } from '@rise-tools/react'
import type * as SVG from 'react-native-svg'
import type * as SVGCSS from 'react-native-svg/css'

export const Circle = createComponentDefinition<typeof SVG.Circle>('@rise-tools/kit-svg/Circle')
export const ClipPath = createComponentDefinition<typeof SVG.ClipPath>(
  '@rise-tools/kit-svg/ClipPath'
)
export const Defs = createComponentDefinition<typeof SVG.Defs>('@rise-tools/kit-svg/Defs')
export const Ellipse = createComponentDefinition<typeof SVG.Ellipse>('@rise-tools/kit-svg/Ellipse')
export const ForeignObject = createComponentDefinition<typeof SVG.ForeignObject>(
  '@rise-tools/kit-svg/ForeignObject'
)
export const G = createComponentDefinition<typeof SVG.G>('@rise-tools/kit-svg/G')
export const Image = createComponentDefinition<typeof SVG.Image>('@rise-tools/kit-svg/Image')
export const Line = createComponentDefinition<typeof SVG.Line>('@rise-tools/kit-svg/Line')
export const LinearGradient = createComponentDefinition<typeof SVG.LinearGradient>(
  '@rise-tools/kit-svg/LinearGradient'
)
export const Marker = createComponentDefinition<typeof SVG.Marker>('@rise-tools/kit-svg/Marker')
export const Mask = createComponentDefinition<typeof SVG.Mask>('@rise-tools/kit-svg/Mask')
export const Path = createComponentDefinition<typeof SVG.Path>('@rise-tools/kit-svg/Path')
export const Pattern = createComponentDefinition<typeof SVG.Pattern>('@rise-tools/kit-svg/Pattern')
export const Polygon = createComponentDefinition<typeof SVG.Polygon>('@rise-tools/kit-svg/Polygon')
export const Polyline = createComponentDefinition<typeof SVG.Polyline>(
  '@rise-tools/kit-svg/Polyline'
)
export const RadialGradient = createComponentDefinition<typeof SVG.RadialGradient>(
  '@rise-tools/kit-svg/RadialGradient'
)
export const Rect = createComponentDefinition<typeof SVG.Rect>('@rise-tools/kit-svg/Rect')
export const Shape = createComponentDefinition<typeof SVG.Shape>('@rise-tools/kit-svg/Shape')
export const Stop = createComponentDefinition<typeof SVG.Stop>('@rise-tools/kit-svg/Stop')
export const Svg = createComponentDefinition<typeof SVG.Svg>('@rise-tools/kit-svg/Svg')
export const Symbol = createComponentDefinition<typeof SVG.Symbol>('@rise-tools/kit-svg/Symbol')
export const Text = createComponentDefinition<typeof SVG.Text>('@rise-tools/kit-svg/Text')
export const TextPath = createComponentDefinition<typeof SVG.TextPath>(
  '@rise-tools/kit-svg/TextPath'
)
export const TSpan = createComponentDefinition<typeof SVG.TSpan>('@rise-tools/kit-svg/TSpan')
export const Use = createComponentDefinition<typeof SVG.Use>('@rise-tools/kit-svg/Use')

export const SvgXml = createComponentDefinition<typeof SVG.SvgXml>('@rise-tools/kit-svg/SvgXml')
export const SvgCss = createComponentDefinition<typeof SVGCSS.SvgCss>('@rise-tools/kit-svg/SvgCss')

export const SvgUri = createComponentDefinition<typeof SVG.SvgUri>('@rise-tools/kit-svg/SvgUri')
export const SvgCssUri = createComponentDefinition<typeof SVGCSS.SvgCssUri>(
  '@rise-tools/kit-svg/SvgCssUri'
)
