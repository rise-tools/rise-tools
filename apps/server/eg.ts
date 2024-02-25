type StageMapping2D = Array<{
  x: number // 0-1
  y: number // 0-1
}>
const egStageRadials = 64
const egStageStripLength = 378 // ??
const egStageInnerRadiusRatio = 0.2416 // calculated with virtual stats from EG laptop: 375 strip length, 989 total diameter

const frameSize = 3 * egStageStripLength * egStageRadials

export const egStageMap: StageMapping2D = []

for (let angularIndex = 0; angularIndex < egStageRadials; angularIndex++) {
  const angle = (angularIndex / egStageRadials) * Math.PI * 2
  const maxY = Math.sin(angle)
  const maxX = Math.cos(angle)
  for (let radialIndex = 0; radialIndex < egStageStripLength; radialIndex++) {
    const radialRatio = radialIndex / egStageStripLength
    const offsetRadialRatio = egStageInnerRadiusRatio + (1 - egStageInnerRadiusRatio) * radialRatio
    const relativeX = maxX * offsetRadialRatio
    const relativeY = maxY * offsetRadialRatio
    const absoluteX = 0.5 + relativeX / 2
    const absoluteY = 0.5 + relativeY / 2

    egStageMap.push({
      x: absoluteX,
      y: absoluteY,
    })
  }
}

export const eg = {
  egStageMap,
  frameSize,
  egStageRadials,
  egStageStripLength,
  egStageInnerRadiusRatio,
}

export type EGInfo = typeof eg
