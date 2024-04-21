import { SelectField } from '@final-ui/kit'

export function getJSXElement() {
  return <SelectField key="selectVideo" unselectedLabel="Select Video..." value={'5'} />
}

console.log(getJSXElement())
// {
//   '$': 'component',
//   component: 'RiseSelectField',
//   key: 'selectVideo',
//   props: { unselectedLabel: 'Select Video...', value: '5' },
//   children: undefined
// }
