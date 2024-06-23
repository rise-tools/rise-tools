import { ComponentRegistry } from '@rise-tools/react'
import * as t from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export const TamaguiComponents: ComponentRegistry = {
  'rise-tools/tamagui/Adapt': {
    component: t.Adapt,
  },
  'rise-tools/tamagui/AdaptContents': {
    component: t.Adapt.Contents,
  },
  /* https://tamagui.dev/ui/stacks#xstack-ystack-zstack */
  'rise-tools/tamagui/View': {
    component: t.View,
  },
  'rise-tools/tamagui/XStack': {
    component: t.XStack,
  },
  'rise-tools/tamagui/YStack': {
    component: t.YStack,
  },
  'rise-tools/tamagui/ZStack': {
    component: t.ZStack,
  },
  'rise-tools/tamagui/SizableStack': {
    component: t.SizableStack,
  },
  /* https://tamagui.dev/ui/headings#api-reference */
  'rise-tools/tamagui/H1': {
    component: t.H1,
  },
  'rise-tools/tamagui/H2': {
    component: t.H2,
  },
  'rise-tools/tamagui/H3': {
    component: t.H3,
  },
  'rise-tools/tamagui/H4': {
    component: t.H4,
  },
  'rise-tools/tamagui/H5': {
    component: t.H5,
  },
  'rise-tools/tamagui/H6': {
    component: t.H6,
  },
  'rise-tools/tamagui/Heading': {
    component: t.Heading,
  },
  /* https://tamagui.dev/ui/text */
  'rise-tools/tamagui/Text': {
    component: t.Text,
  },
  'rise-tools/tamagui/Paragraph': {
    component: t.Paragraph,
  },
  'rise-tools/tamagui/SizableText': {
    component: t.SizableText,
  },
  /* https://tamagui.dev/ui/button */
  'rise-tools/tamagui/Button': {
    component: t.Button,
  },
  /* https://tamagui.dev/ui/checkbox */
  'rise-tools/tamagui/Checkbox': {
    component: t.Checkbox,
  },
  /* https://tamagui.dev/ui/form */
  'rise-tools/tamagui/Form': {
    component: t.Form,
  },
  'rise-tools/tamagui/FormTrigger': {
    component: t.FormTrigger,
  },
  /* https://tamagui.dev/ui/inputs */
  'rise-tools/tamagui/Input': {
    component: t.Input,
  },
  'rise-tools/tamagui/TextArea': {
    component: t.TextArea,
  },
  /* https://tamagui.dev/ui/label */
  'rise-tools/tamagui/Label': {
    component: t.Label,
  },
  /* https://tamagui.dev/ui/progress */
  'rise-tools/tamagui/Progress': {
    component: t.Progress,
  },
  'rise-tools/tamagui/ProgressIndicator': {
    component: t.ProgressIndicator,
  },
  /* https://tamagui.dev/ui/radio */
  'rise-tools/tamagui/RadioGroup': {
    component: t.RadioGroup,
  },
  'rise-tools/tamagui/RadioGroupItem': {
    component: t.RadioGroup.Item,
  },
  'rise-tools/tamagui/RadioGroupIndicator': {
    component: t.RadioGroup.Indicator,
  },
  /* https://tamagui.dev/ui/select */
  'rise-tools/tamagui/Select': {
    component: t.Select,
  },
  'rise-tools/tamagui/SelectTrigger': {
    component: t.Select.Trigger,
  },
  'rise-tools/tamagui/SelectScrollDownButton': {
    component: t.Select.ScrollDownButton,
  },
  'rise-tools/tamagui/SelectScrollUpButton': {
    component: t.Select.ScrollUpButton,
  },
  'rise-tools/tamagui/SelectViewport': {
    component: t.Select.Viewport,
  },
  'rise-tools/tamagui/SelectGroup': {
    component: t.Select.Group,
  },
  'rise-tools/tamagui/SelectLabel': {
    component: t.Select.Label,
  },
  'rise-tools/tamagui/SelectItem': {
    component: t.Select.Item,
  },
  'rise-tools/tamagui/SelectItemText': {
    component: t.Select.ItemText,
  },
  'rise-tools/tamagui/SelectItemIndicator': {
    component: t.Select.ItemIndicator,
  },
  'rise-tools/tamagui/SelectSheet': {
    component: t.Select.Sheet,
  },
  'rise-tools/tamagui/SelectContent': {
    component: t.Select.Content,
  },
  'rise-tools/tamagui/SelectValue': {
    component: t.Select.Value,
  },
  /* https://tamagui.dev/ui/slider */
  'rise-tools/tamagui/Slider': {
    component: t.Slider,
  },
  'rise-tools/tamagui/SliderTrack': {
    component: t.Slider.Track,
  },
  'rise-tools/tamagui/SliderTrackActive': {
    component: t.Slider.TrackActive,
  },
  'rise-tools/tamagui/SliderThumb': {
    component: t.Slider.Thumb,
  },
  /* https://tamagui.dev/ui/switch */
  'rise-tools/tamagui/Switch': {
    component: t.Switch,
  },
  'rise-tools/tamagui/SwitchThumb': {
    component: t.Switch.Thumb,
  },
  /* https://tamagui.dev/ui/toggle-group */
  'rise-tools/tamagui/ToggleGroup': {
    component: t.ToggleGroup,
  },
  'rise-tools/tamagui/ToggleGroupItem': {
    component: t.ToggleGroup.Item,
  },
  /* https://tamagui.dev/ui/alert-dialog */
  'rise-tools/tamagui/AlertDialog': {
    component: t.AlertDialog,
  },
  'rise-tools/tamagui/AlertDialogTitle': {
    component: t.AlertDialog.Title,
  },
  'rise-tools/tamagui/AlertDialogContent': {
    component: t.AlertDialog.Content,
  },
  'rise-tools/tamagui/AlertDialogPortal': {
    component: t.AlertDialog.Portal,
  },
  'rise-tools/tamagui/AlertDialogOverlay': {
    component: t.AlertDialog.Overlay,
  },
  'rise-tools/tamagui/AlertDialogAction': {
    component: t.AlertDialog.Action,
  },
  'rise-tools/tamagui/AlertDialogTrigger': {
    component: t.AlertDialog.Trigger,
  },
  'rise-tools/tamagui/AlertDialogCancel': {
    component: t.AlertDialog.Cancel,
  },
  'rise-tools/tamagui/PortalProvider': {
    component: t.PortalProvider,
  },
  /* https://tamagui.dev/ui/dialog */
  'rise-tools/tamagui/Dialog': {
    component: t.Dialog,
  },
  'rise-tools/tamagui/DialogTrigger': {
    component: t.Dialog.Trigger,
  },
  'rise-tools/tamagui/DialogTitle': {
    component: t.Dialog.Title,
  },
  'rise-tools/tamagui/DialogContent': {
    component: t.Dialog.Content,
  },
  'rise-tools/tamagui/DialogPortal': {
    component: t.Dialog.Portal,
  },
  'rise-tools/tamagui/DialogOverlay': {
    component: t.Dialog.Overlay,
  },
  'rise-tools/tamagui/DialogClose': {
    component: t.Dialog.Close,
  },
  'rise-tools/tamagui/DialogSheet': {
    component: t.Dialog.Sheet,
  },
  /* https://tamagui.dev/ui/popover */
  'rise-tools/tamagui/Popover': {
    component: t.Popover,
  },
  'rise-tools/tamagui/PopoverTrigger': {
    component: t.Popover.Trigger,
  },
  'rise-tools/tamagui/PopoverContent': {
    component: t.Popover.Content,
  },
  'rise-tools/tamagui/PopoverAnchor': {
    component: t.Popover.Anchor,
  },
  'rise-tools/tamagui/PopoverSheet': {
    component: t.Popover.Sheet,
  },
  'rise-tools/tamagui/PopoverScrollView': {
    component: t.Popover.ScrollView,
  },
  /* https://tamagui.dev/ui/sheet */
  'rise-tools/tamagui/Sheet': {
    component: t.Sheet,
  },
  'rise-tools/tamagui/SheetOverlay': {
    component: t.Sheet.Overlay,
  },
  'rise-tools/tamagui/SheetFrame': {
    component: t.Sheet.Frame,
  },
  'rise-tools/tamagui/SheetHandle': {
    component: t.Sheet.Handle,
  },
  'rise-tools/tamagui/SheetScrollView': {
    component: t.Sheet.ScrollView,
  },
  /* https://tamagui.dev/ui/tooltip */
  'rise-tools/tamagui/Tooltip': {
    component: t.Tooltip,
  },
  'rise-tools/tamagui/TooltipTrigger': {
    component: t.Tooltip.Trigger,
  },
  'rise-tools/tamagui/TooltipContent': {
    component: t.Tooltip.Content,
  },
  'rise-tools/tamagui/TooltipAnchor': {
    component: t.Tooltip.Anchor,
  },
  /* https://tamagui.dev/ui/accordion */
  'rise-tools/tamagui/Accordion': {
    component: t.Accordion,
  },
  'rise-tools/tamagui/AccordionItem': {
    component: t.Accordion.Item,
  },
  'rise-tools/tamagui/AccordionHeader': {
    component: t.Accordion.Header,
  },
  'rise-tools/tamagui/AccordionTrigger': {
    component: t.Accordion.Trigger,
  },
  'rise-tools/tamagui/AccordionContent': {
    component: t.Accordion.Content,
  },
  /* https://tamagui.dev/ui/group */
  'rise-tools/tamagui/Group': {
    component: t.Group,
  },
  'rise-tools/tamagui/GroupItem': {
    component: t.Group.Item,
  },
  /* https://tamagui.dev/ui/tabs */
  'rise-tools/tamagui/Tabs': {
    component: t.Tabs,
  },
  'rise-tools/tamagui/TabsList': {
    component: t.Tabs.List,
  },
  'rise-tools/tamagui/TabsTrigger': {
    component: t.Tabs.Trigger,
  },
  'rise-tools/tamagui/TabsContent': {
    component: t.Tabs.Content,
  },
  /* https://tamagui.dev/ui/avatar */
  'rise-tools/tamagui/Avatar': {
    component: t.Avatar,
  },
  'rise-tools/tamagui/AvatarImage': {
    component: t.Avatar.Image,
  },
  'rise-tools/tamagui/AvatarFallback': {
    component: t.Avatar.Fallback,
  },
  /* https://tamagui.dev/ui/card */
  'rise-tools/tamagui/Card': {
    component: t.Card,
  },
  'rise-tools/tamagui/CardHeader': {
    component: t.Card.Header,
  },
  'rise-tools/tamagui/CardFooter': {
    component: t.Card.Footer,
  },
  'rise-tools/tamagui/CardBackground': {
    component: t.Card.Background,
  },
  /* https://tamagui.dev/ui/image */
  'rise-tools/tamagui/Image': {
    component: t.Image,
  },
  /* https://tamagui.dev/ui/list-item */
  'rise-tools/tamagui/ListItem': {
    component: t.ListItem,
  },
  'rise-tools/tamagui/ListItemText': {
    component: t.ListItemText,
  },
  'rise-tools/tamagui/ListItemTitle': {
    component: t.ListItemTitle,
  },
  'rise-tools/tamagui/ListItemSubtitle': {
    component: t.ListItemSubtitle,
  },
  /* https://tamagui.dev/ui/separator */
  'rise-tools/tamagui/Separator': {
    component: t.Separator,
  },
  /* https://tamagui.dev/ui/shapes */
  'rise-tools/tamagui/Square': {
    component: t.Square,
  },
  'rise-tools/tamagui/Circle': {
    component: t.Circle,
  },
  /* https://tamagui.dev/ui/anchor */
  'rise-tools/tamagui/Anchor': {
    component: t.Anchor,
  },
  /* https://tamagui.dev/ui/html-elements */
  'rise-tools/tamagui/Section': {
    component: t.Section,
  },
  'rise-tools/tamagui/Article': {
    component: t.Article,
  },
  'rise-tools/tamagui/Main': {
    component: t.Main,
  },
  'rise-tools/tamagui/Header': {
    component: t.Header,
  },
  'rise-tools/tamagui/Aside': {
    component: t.Aside,
  },
  'rise-tools/tamagui/Footer': {
    component: t.Footer,
  },
  'rise-tools/tamagui/Nav': {
    component: t.Nav,
  },
  /* https://tamagui.dev/ui/scroll-view */
  'rise-tools/tamagui/ScrollView': {
    component: t.ScrollView,
  },
  /* https://tamagui.dev/ui/spinner */
  'rise-tools/tamagui/Spinner': {
    component: t.Spinner,
  },
  /*  https://tamagui.dev/ui/unspaced */
  'rise-tools/tamagui/Unspaced': {
    component: t.Unspaced,
  },
  /* https://tamagui.dev/ui/visually-hidden */
  'rise-tools/tamagui/VisuallyHidden': {
    component: t.VisuallyHidden,
  },
  /* https://tamagui.dev/ui/linear-gradient */
  'rise-tools/tamagui/LinearGradient': {
    component: LinearGradient,
  },
  'rise-tools/tamagui/Theme': {
    component: t.Theme,
  },
}
