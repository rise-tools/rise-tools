import { SelectField } from '@final-ui/kit'

export function getJSXElement() {
  return (
    <SelectField
      key="selectVideo"
      unselectedLabel="Select Video..."
      value={'5'}
      onValueChange={(number) => console.log(number)}
    />
  )
}

console.log(getJSXElement())
// {
//   '$': 'component',
//   component: 'RiseSelectField',
//   key: 'selectVideo',
//   props: {
//     value: '5',
//     unselectedLabel: 'Select Video...',
//     onValueChange: { '$': 'event', action: 'generate-uuid-for-handler' }
//   },
//   children: undefined
// }
