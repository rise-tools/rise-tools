/* @jsxImportSource .. */

import { createComponentDefinition } from '../jsx-runtime'
import { ComponentModelState, isComponentModelState, isEventModelState } from '../rise'

const View = createComponentDefinition('View')

it('should render component definition', () => {
  expect(isComponentModelState(<View />)).toBe(true)
})

it('should render function', () => {
  const Screen = () => <View />
  expect(isComponentModelState(<Screen />)).toBe(true)
})

it('should render fragments', () => {
  expect(
    <>
      <View>foo</View>
      <View>bar</View>
    </>
  ).toMatchInlineSnapshot(`
    Object {
      "$": "component",
      "$staticChildren": true,
      "children": Array [
        Object {
          "$": "component",
          "children": "foo",
          "component": "View",
          "key": undefined,
          "props": Object {},
        },
        Object {
          "$": "component",
          "children": "bar",
          "component": "View",
          "key": undefined,
          "props": Object {},
        },
      ],
      "component": "@rise-tools/react/Fragment",
      "key": undefined,
      "props": Object {},
    }
  `)
})

it('should turn function props into event', () => {
  const el = <View onPress={jest.fn()} />
  expect(isEventModelState(el.props.onPress)).toBe(true)
})

it('should set static children', () => {
  const Section = ({ children }) => {
    return (
      <View>
        <View>{children}</View>
      </View>
    )
  }
  expect(
    <Section>
      <View>Foo</View>
      <View>Bar</View>
    </Section>
  ).toMatchInlineSnapshot(`
    Object {
      "$": "component",
      "children": Object {
        "$": "component",
        "$staticChildren": true,
        "children": Array [
          Object {
            "$": "component",
            "children": "Foo",
            "component": "View",
            "key": undefined,
            "props": Object {},
          },
          Object {
            "$": "component",
            "children": "Bar",
            "component": "View",
            "key": undefined,
            "props": Object {},
          },
        ],
        "component": "View",
        "key": undefined,
        "props": Object {},
      },
      "component": "View",
      "key": undefined,
      "props": Object {},
    }
  `)
})
