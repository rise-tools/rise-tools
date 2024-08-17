import { SubmitButton } from '@rise-tools/kit-forms'
import {
  ComponentProps,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { Button, ButtonProps, Sheet, SheetProps, YStack } from 'tamagui'

type BottomSheetProps = Omit<SheetProps, 'onOpenChange' | 'open'>
type BottomSheetContext = {
  setOpen: Dispatch<SetStateAction<boolean>>
}
const BottomSheetContext = createContext<BottomSheetContext>({
  setOpen: () => {
    throw new Error('BottomSheetContext not provided')
  },
})

export function BottomSheet({
  trigger,
  children,
  frameProps,
  ...props
}: Omit<BottomSheetProps, 'open' | 'onOpenChange'> & {
  trigger: React.ReactNode
  frameProps: ComponentProps<typeof Sheet.Frame>
}) {
  const [open, setOpen] = useState(false)
  return (
    <BottomSheetContext.Provider value={{ setOpen }}>
      <YStack>
        {trigger}
        <Sheet
          dismissOnSnapToBottom
          modal={true}
          forceRemoveScrollEnabled={open}
          {...props}
          open={open}
          onOpenChange={setOpen}
        >
          <Sheet.Overlay animation="quick" />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" justifyContent="center" {...frameProps}>
            {children}
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </BottomSheetContext.Provider>
  )
}

export function BottomSheetTriggerButton({ children, ...props }: ButtonProps) {
  const { setOpen } = useContext(BottomSheetContext)
  return (
    <Button
      {...props}
      onPress={(e) => {
        props.onPress?.(e)
        setOpen(true)
      }}
    >
      {children}
    </Button>
  )
}

export function BottomSheetCloseButton({ children, ...props }: ButtonProps) {
  const { setOpen } = useContext(BottomSheetContext)
  return (
    <Button
      {...props}
      onPress={(e) => {
        props.onPress?.(e)
        setOpen(false)
      }}
    >
      {children}
    </Button>
  )
}

export function BottomSheetSubmitButton({
  children,
  ...props
}: ComponentProps<typeof SubmitButton>) {
  const { setOpen } = useContext(BottomSheetContext)
  return (
    <SubmitButton
      {...props}
      onPress={async (e) => {
        props.onPress?.(e)
        setOpen(false)
      }}
    >
      {children}
    </SubmitButton>
  )
}
