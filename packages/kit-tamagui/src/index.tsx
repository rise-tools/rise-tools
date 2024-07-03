import { ComponentRegistry } from '@rise-tools/react'
import * as t from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export const TamaguiComponents: ComponentRegistry = {
  'rise-tools/kit-tamagui/Adapt': {
    component: t.Adapt,
  },
  'rise-tools/kit-tamagui/AdaptContents': {
    component: t.Adapt.Contents,
  },
  /* https://tamagui.dev/ui/stacks#xstack-ystack-zstack */
  'rise-tools/kit-tamagui/View': {
    component: t.View,
  },
  'rise-tools/kit-tamagui/XStack': {
    component: t.XStack,
  },
  'rise-tools/kit-tamagui/YStack': {
    component: t.YStack,
  },
  'rise-tools/kit-tamagui/ZStack': {
    component: t.ZStack,
  },
  'rise-tools/kit-tamagui/SizableStack': {
    component: t.SizableStack,
  },
  /* https://tamagui.dev/ui/headings#api-reference */
  'rise-tools/kit-tamagui/H1': {
    component: t.H1,
  },
  'rise-tools/kit-tamagui/H2': {
    component: t.H2,
  },
  'rise-tools/kit-tamagui/H3': {
    component: t.H3,
  },
  'rise-tools/kit-tamagui/H4': {
    component: t.H4,
  },
  'rise-tools/kit-tamagui/H5': {
    component: t.H5,
  },
  'rise-tools/kit-tamagui/H6': {
    component: t.H6,
  },
  'rise-tools/kit-tamagui/Heading': {
    component: t.Heading,
  },
  /* https://tamagui.dev/ui/text */
  'rise-tools/kit-tamagui/Text': {
    component: t.Text,
  },
  'rise-tools/kit-tamagui/Paragraph': {
    component: t.Paragraph,
  },
  'rise-tools/kit-tamagui/SizableText': {
    component: t.SizableText,
  },
  /* https://tamagui.dev/ui/button */
  'rise-tools/kit-tamagui/Button': {
    component: t.Button,
  },
  /* https://tamagui.dev/ui/checkbox */
  'rise-tools/kit-tamagui/Checkbox': {
    component: t.Checkbox,
  },
  /* https://tamagui.dev/ui/form */
  'rise-tools/kit-tamagui/Form': {
    component: t.Form,
  },
  'rise-tools/kit-tamagui/FormTrigger': {
    component: t.FormTrigger,
  },
  /* https://tamagui.dev/ui/inputs */
  'rise-tools/kit-tamagui/Input': {
    component: t.Input,
  },
  'rise-tools/kit-tamagui/TextArea': {
    component: t.TextArea,
  },
  /* https://tamagui.dev/ui/label */
  'rise-tools/kit-tamagui/Label': {
    component: t.Label,
  },
  /* https://tamagui.dev/ui/progress */
  'rise-tools/kit-tamagui/Progress': {
    component: t.Progress,
  },
  'rise-tools/kit-tamagui/ProgressIndicator': {
    component: t.ProgressIndicator,
  },
  /* https://tamagui.dev/ui/radio */
  'rise-tools/kit-tamagui/RadioGroup': {
    component: t.RadioGroup,
  },
  'rise-tools/kit-tamagui/RadioGroupItem': {
    component: t.RadioGroup.Item,
  },
  'rise-tools/kit-tamagui/RadioGroupIndicator': {
    component: t.RadioGroup.Indicator,
  },
  /* https://tamagui.dev/ui/select */
  'rise-tools/kit-tamagui/Select': {
    component: t.Select,
  },
  'rise-tools/kit-tamagui/SelectTrigger': {
    component: t.Select.Trigger,
  },
  'rise-tools/kit-tamagui/SelectScrollDownButton': {
    component: t.Select.ScrollDownButton,
  },
  'rise-tools/kit-tamagui/SelectScrollUpButton': {
    component: t.Select.ScrollUpButton,
  },
  'rise-tools/kit-tamagui/SelectViewport': {
    component: t.Select.Viewport,
  },
  'rise-tools/kit-tamagui/SelectGroup': {
    component: t.Select.Group,
  },
  'rise-tools/kit-tamagui/SelectLabel': {
    component: t.Select.Label,
  },
  'rise-tools/kit-tamagui/SelectItem': {
    component: t.Select.Item,
  },
  'rise-tools/kit-tamagui/SelectItemText': {
    component: t.Select.ItemText,
  },
  'rise-tools/kit-tamagui/SelectItemIndicator': {
    component: t.Select.ItemIndicator,
  },
  'rise-tools/kit-tamagui/SelectSheet': {
    component: t.Select.Sheet,
  },
  'rise-tools/kit-tamagui/SelectContent': {
    component: t.Select.Content,
  },
  'rise-tools/kit-tamagui/SelectValue': {
    component: t.Select.Value,
  },
  /* https://tamagui.dev/ui/slider */
  'rise-tools/kit-tamagui/Slider': {
    component: t.Slider,
  },
  'rise-tools/kit-tamagui/SliderTrack': {
    component: t.Slider.Track,
  },
  'rise-tools/kit-tamagui/SliderTrackActive': {
    component: t.Slider.TrackActive,
  },
  'rise-tools/kit-tamagui/SliderThumb': {
    component: t.Slider.Thumb,
  },
  /* https://tamagui.dev/ui/switch */
  'rise-tools/kit-tamagui/Switch': {
    component: t.Switch,
  },
  'rise-tools/kit-tamagui/SwitchThumb': {
    component: t.Switch.Thumb,
  },
  /* https://tamagui.dev/ui/toggle-group */
  'rise-tools/kit-tamagui/ToggleGroup': {
    component: t.ToggleGroup,
  },
  'rise-tools/kit-tamagui/ToggleGroupItem': {
    component: t.ToggleGroup.Item,
  },
  /* https://tamagui.dev/ui/alert-dialog */
  'rise-tools/kit-tamagui/AlertDialog': {
    component: t.AlertDialog,
  },
  'rise-tools/kit-tamagui/AlertDialogTitle': {
    component: t.AlertDialog.Title,
  },
  'rise-tools/kit-tamagui/AlertDialogContent': {
    component: t.AlertDialog.Content,
  },
  'rise-tools/kit-tamagui/AlertDialogPortal': {
    component: t.AlertDialog.Portal,
  },
  'rise-tools/kit-tamagui/AlertDialogOverlay': {
    component: t.AlertDialog.Overlay,
  },
  'rise-tools/kit-tamagui/AlertDialogAction': {
    component: t.AlertDialog.Action,
  },
  'rise-tools/kit-tamagui/AlertDialogTrigger': {
    component: t.AlertDialog.Trigger,
  },
  'rise-tools/kit-tamagui/AlertDialogCancel': {
    component: t.AlertDialog.Cancel,
  },
  'rise-tools/kit-tamagui/PortalProvider': {
    component: t.PortalProvider,
  },
  /* https://tamagui.dev/ui/dialog */
  'rise-tools/kit-tamagui/Dialog': {
    component: t.Dialog,
  },
  'rise-tools/kit-tamagui/DialogTrigger': {
    component: t.Dialog.Trigger,
  },
  'rise-tools/kit-tamagui/DialogTitle': {
    component: t.Dialog.Title,
  },
  'rise-tools/kit-tamagui/DialogContent': {
    component: t.Dialog.Content,
  },
  'rise-tools/kit-tamagui/DialogPortal': {
    component: t.Dialog.Portal,
  },
  'rise-tools/kit-tamagui/DialogOverlay': {
    component: t.Dialog.Overlay,
  },
  'rise-tools/kit-tamagui/DialogClose': {
    component: t.Dialog.Close,
  },
  'rise-tools/kit-tamagui/DialogSheet': {
    component: t.Dialog.Sheet,
  },
  /* https://tamagui.dev/ui/popover */
  'rise-tools/kit-tamagui/Popover': {
    component: t.Popover,
  },
  'rise-tools/kit-tamagui/PopoverTrigger': {
    component: t.Popover.Trigger,
  },
  'rise-tools/kit-tamagui/PopoverContent': {
    component: t.Popover.Content,
  },
  'rise-tools/kit-tamagui/PopoverAnchor': {
    component: t.Popover.Anchor,
  },
  'rise-tools/kit-tamagui/PopoverSheet': {
    component: t.Popover.Sheet,
  },
  'rise-tools/kit-tamagui/PopoverScrollView': {
    component: t.Popover.ScrollView,
  },
  /* https://tamagui.dev/ui/sheet */
  'rise-tools/kit-tamagui/Sheet': {
    component: t.Sheet,
  },
  'rise-tools/kit-tamagui/SheetOverlay': {
    component: t.Sheet.Overlay,
  },
  'rise-tools/kit-tamagui/SheetFrame': {
    component: t.Sheet.Frame,
  },
  'rise-tools/kit-tamagui/SheetHandle': {
    component: t.Sheet.Handle,
  },
  'rise-tools/kit-tamagui/SheetScrollView': {
    component: t.Sheet.ScrollView,
  },
  /* https://tamagui.dev/ui/tooltip */
  'rise-tools/kit-tamagui/Tooltip': {
    component: t.Tooltip,
  },
  'rise-tools/kit-tamagui/TooltipTrigger': {
    component: t.Tooltip.Trigger,
  },
  'rise-tools/kit-tamagui/TooltipContent': {
    component: t.Tooltip.Content,
  },
  'rise-tools/kit-tamagui/TooltipAnchor': {
    component: t.Tooltip.Anchor,
  },
  /* https://tamagui.dev/ui/accordion */
  'rise-tools/kit-tamagui/Accordion': {
    component: t.Accordion,
  },
  'rise-tools/kit-tamagui/AccordionItem': {
    component: t.Accordion.Item,
  },
  'rise-tools/kit-tamagui/AccordionHeader': {
    component: t.Accordion.Header,
  },
  'rise-tools/kit-tamagui/AccordionTrigger': {
    component: t.Accordion.Trigger,
  },
  'rise-tools/kit-tamagui/AccordionContent': {
    component: t.Accordion.Content,
  },
  /* https://tamagui.dev/ui/group */
  'rise-tools/kit-tamagui/Group': {
    component: t.Group,
  },
  'rise-tools/kit-tamagui/GroupItem': {
    component: t.Group.Item,
  },
  /* https://tamagui.dev/ui/tabs */
  'rise-tools/kit-tamagui/Tabs': {
    component: t.Tabs,
  },
  'rise-tools/kit-tamagui/TabsList': {
    component: t.Tabs.List,
  },
  'rise-tools/kit-tamagui/TabsTrigger': {
    component: t.Tabs.Trigger,
  },
  'rise-tools/kit-tamagui/TabsContent': {
    component: t.Tabs.Content,
  },
  /* https://tamagui.dev/ui/avatar */
  'rise-tools/kit-tamagui/Avatar': {
    component: t.Avatar,
  },
  'rise-tools/kit-tamagui/AvatarImage': {
    component: t.Avatar.Image,
  },
  'rise-tools/kit-tamagui/AvatarFallback': {
    component: t.Avatar.Fallback,
  },
  /* https://tamagui.dev/ui/card */
  'rise-tools/kit-tamagui/Card': {
    component: t.Card,
  },
  'rise-tools/kit-tamagui/CardHeader': {
    component: t.Card.Header,
  },
  'rise-tools/kit-tamagui/CardFooter': {
    component: t.Card.Footer,
  },
  'rise-tools/kit-tamagui/CardBackground': {
    component: t.Card.Background,
  },
  /* https://tamagui.dev/ui/image */
  'rise-tools/kit-tamagui/Image': {
    component: t.Image,
  },
  /* https://tamagui.dev/ui/list-item */
  'rise-tools/kit-tamagui/ListItem': {
    component: t.ListItem,
  },
  'rise-tools/kit-tamagui/ListItemText': {
    component: t.ListItemText,
  },
  'rise-tools/kit-tamagui/ListItemTitle': {
    component: t.ListItemTitle,
  },
  'rise-tools/kit-tamagui/ListItemSubtitle': {
    component: t.ListItemSubtitle,
  },
  /* https://tamagui.dev/ui/separator */
  'rise-tools/kit-tamagui/Separator': {
    component: t.Separator,
  },
  /* https://tamagui.dev/ui/shapes */
  'rise-tools/kit-tamagui/Square': {
    component: t.Square,
  },
  'rise-tools/kit-tamagui/Circle': {
    component: t.Circle,
  },
  /* https://tamagui.dev/ui/anchor */
  'rise-tools/kit-tamagui/Anchor': {
    component: t.Anchor,
  },
  /* https://tamagui.dev/ui/html-elements */
  'rise-tools/kit-tamagui/Section': {
    component: t.Section,
  },
  'rise-tools/kit-tamagui/Article': {
    component: t.Article,
  },
  'rise-tools/kit-tamagui/Main': {
    component: t.Main,
  },
  'rise-tools/kit-tamagui/Header': {
    component: t.Header,
  },
  'rise-tools/kit-tamagui/Aside': {
    component: t.Aside,
  },
  'rise-tools/kit-tamagui/Footer': {
    component: t.Footer,
  },
  'rise-tools/kit-tamagui/Nav': {
    component: t.Nav,
  },
  /* https://tamagui.dev/ui/scroll-view */
  'rise-tools/kit-tamagui/ScrollView': {
    component: t.ScrollView,
  },
  /* https://tamagui.dev/ui/spinner */
  'rise-tools/kit-tamagui/Spinner': {
    component: t.Spinner,
  },
  /*  https://tamagui.dev/ui/unspaced */
  'rise-tools/kit-tamagui/Unspaced': {
    component: t.Unspaced,
  },
  /* https://tamagui.dev/ui/visually-hidden */
  'rise-tools/kit-tamagui/VisuallyHidden': {
    component: t.VisuallyHidden,
  },
  /* https://tamagui.dev/ui/linear-gradient */
  'rise-tools/kit-tamagui/LinearGradient': {
    component: LinearGradient,
  },
  'rise-tools/kit-tamagui/Theme': {
    component: t.Theme,
  },
}
