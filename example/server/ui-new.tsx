// tbd: move to different entry-point for server-side code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RiseSelectField = (props: { unselectedLabel: string; value: string }) => 'RiseSelectField'

export function getJSXElement() {
  return <RiseSelectField key="selectVideo" unselectedLabel="Select Video..." value={'5'} />
}

console.log(getJSXElement())
// {
//   '$': 'component',
//   component: 'RiseSelectField',
//   key: 'selectVideo',
//   props: { unselectedLabel: 'Select Video...', value: '5' },
//   children: undefined
// }
