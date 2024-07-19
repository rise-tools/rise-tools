/* @jsxImportSource .. */

import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'

import { createComponentDefinition } from '../jsx-runtime'
import { isComponentModelState, isEventModelState } from '../rise'

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
    {
      "$": "component",
      "$staticChildren": true,
      "children": [
        {
          "$": "component",
          "children": "foo",
          "component": "View",
          "key": undefined,
          "props": {},
        },
        {
          "$": "component",
          "children": "bar",
          "component": "View",
          "key": undefined,
          "props": {},
        },
      ],
      "component": "rise-tools/react/Fragment",
      "key": undefined,
      "props": {},
    }
  `)
})

it('should turn function props into event', () => {
  const el = <View onPress={vi.fn()} />
  expect(isEventModelState(el.props.onPress)).toBe(true)
})

it('should set static children', () => {
  const Section = ({ children }: { children: ReactNode }) => {
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
    {
      "$": "component",
      "children": {
        "$": "component",
        "$staticChildren": true,
        "children": [
          {
            "$": "component",
            "children": "Foo",
            "component": "View",
            "key": undefined,
            "props": {},
          },
          {
            "$": "component",
            "children": "Bar",
            "component": "View",
            "key": undefined,
            "props": {},
          },
        ],
        "component": "View",
        "key": undefined,
        "props": {},
      },
      "component": "View",
      "key": undefined,
      "props": {},
    }
  `)
  // Since DynamicSection maps over children, its type should change from static to dynamic
  const DynamicSection = ({ children }: { children: ReactNode[] }) => {
    return (
      <View>
        <View>
          {children.map((_el, idx) => (
            <View>{idx}</View>
          ))}
        </View>
      </View>
    )
  }
  expect(
    <DynamicSection>
      <View>Foo</View>
      <View>Bar</View>
    </DynamicSection>
  ).toMatchInlineSnapshot(`
    {
      "$": "component",
      "children": {
        "$": "component",
        "children": [
          {
            "$": "component",
            "children": 0,
            "component": "View",
            "key": undefined,
            "props": {},
          },
          {
            "$": "component",
            "children": 1,
            "component": "View",
            "key": undefined,
            "props": {},
          },
        ],
        "component": "View",
        "key": undefined,
        "props": {},
      },
      "component": "View",
      "key": undefined,
      "props": {},
    }
  `)
})
