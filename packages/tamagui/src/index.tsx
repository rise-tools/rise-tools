import { ComponentRegistry } from '@rise-tools/react'
import * as t from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

// tbd: check all components and make sure all events are wrapped

export const TamaguiComponents: ComponentRegistry = {
  Adapt: {
    component: t.Adapt,
  },
  AdaptContents: {
    component: t.Adapt.Contents,
  },
  /* https://tamagui.dev/ui/stacks#xstack-ystack-zstack */
  View: {
    component: t.View,
  },
  XStack: {
    component: t.XStack,
  },
  YStack: {
    component: t.YStack,
  },
  ZStack: {
    component: t.ZStack,
  },
  SizableStack: {
    component: t.SizableStack,
  },
  /* https://tamagui.dev/ui/headings#api-reference */
  H1: {
    component: t.H1,
  },
  H2: {
    component: t.H2,
  },
  H3: {
    component: t.H3,
  },
  H4: {
    component: t.H4,
  },
  H5: {
    component: t.H5,
  },
  H6: {
    component: t.H6,
  },
  Heading: {
    component: t.Heading,
  },
  /* https://tamagui.dev/ui/text */
  Text: {
    component: t.Text,
  },
  Paragraph: {
    component: t.Paragraph,
  },
  SizableText: {
    component: t.SizableText,
  },
  /* https://tamagui.dev/ui/button */
  Button: {
    component: t.Button,
  },
  /* https://tamagui.dev/ui/checkbox */
  Checkbox: {
    component: t.Checkbox,
  },
  /* https://tamagui.dev/ui/form */
  Form: {
    component: t.Form,
  },
  FormTrigger: {
    component: t.FormTrigger,
  },
  /* https://tamagui.dev/ui/inputs */
  Input: {
    component: t.Input,
  },
  TextArea: {
    component: t.TextArea,
  },
  /* https://tamagui.dev/ui/label */
  Label: {
    component: t.Label,
  },
  /* https://tamagui.dev/ui/progress */
  Progress: {
    component: t.Progress,
  },
  ProgressIndicator: {
    component: t.ProgressIndicator,
  },
  /* https://tamagui.dev/ui/radio */
  RadioGroup: {
    component: t.RadioGroup,
  },
  RadioGroupItem: {
    component: t.RadioGroup.Item,
  },
  RadioGroupIndicator: {
    component: t.RadioGroup.Indicator,
  },
  /* https://tamagui.dev/ui/select */
  Select: {
    component: t.Select,
  },
  SelectTrigger: {
    component: t.Select.Trigger,
  },
  SelectScrollDownButton: {
    component: t.Select.ScrollDownButton,
  },
  SelectScrollUpButton: {
    component: t.Select.ScrollUpButton,
  },
  SelectViewport: {
    component: t.Select.Viewport,
  },
  SelectGroup: {
    component: t.Select.Group,
  },
  SelectLabel: {
    component: t.Select.Label,
  },
  SelectItem: {
    component: t.Select.Item,
  },
  SelectItemText: {
    component: t.Select.ItemText,
  },
  SelectItemIndicator: {
    component: t.Select.ItemIndicator,
  },
  SelectSheet: {
    component: t.Select.Sheet,
  },
  SelectContent: {
    component: t.Select.Content,
  },
  SelectValue: {
    component: t.Select.Value,
  },
  /* https://tamagui.dev/ui/slider */
  Slider: {
    component: t.Slider,
  },
  SliderTrack: {
    component: t.Slider.Track,
  },
  SliderTrackActive: {
    component: t.Slider.TrackActive,
  },
  SliderThumb: {
    component: t.Slider.Thumb,
  },
  /* https://tamagui.dev/ui/switch */
  Switch: {
    component: t.Switch,
  },
  SwitchThumb: {
    component: t.Switch.Thumb,
  },
  /* https://tamagui.dev/ui/toggle-group */
  ToggleGroup: {
    component: t.ToggleGroup,
  },
  ToggleGroupItem: {
    component: t.ToggleGroup.Item,
  },
  /* https://tamagui.dev/ui/alert-dialog */
  AlertDialog: {
    component: t.AlertDialog,
  },
  AlertDialogTitle: {
    component: t.AlertDialog.Title,
  },
  AlertDialogContent: {
    component: t.AlertDialog.Content,
  },
  AlertDialogPortal: {
    component: t.AlertDialog.Portal,
  },
  AlertDialogOverlay: {
    component: t.AlertDialog.Overlay,
  },
  AlertDialogAction: {
    component: t.AlertDialog.Action,
  },
  AlertDialogTrigger: {
    component: t.AlertDialog.Trigger,
  },
  AlertDialogCancel: {
    component: t.AlertDialog.Cancel,
  },
  PortalProvider: {
    component: t.PortalProvider,
  },
  /* https://tamagui.dev/ui/dialog */
  Dialog: {
    component: t.Dialog,
  },
  DialogTrigger: {
    component: t.Dialog.Trigger,
  },
  DialogTitle: {
    component: t.Dialog.Title,
  },
  DialogContent: {
    component: t.Dialog.Content,
  },
  DialogPortal: {
    component: t.Dialog.Portal,
  },
  DialogOverlay: {
    component: t.Dialog.Overlay,
  },
  DialogClose: {
    component: t.Dialog.Close,
  },
  DialogSheet: {
    component: t.Dialog.Sheet,
  },
  /* https://tamagui.dev/ui/popover */
  Popover: {
    component: t.Popover,
  },
  PopoverTrigger: {
    component: t.Popover.Trigger,
  },
  PopoverContent: {
    component: t.Popover.Content,
  },
  PopoverAnchor: {
    component: t.Popover.Anchor,
  },
  PopoverSheet: {
    component: t.Popover.Sheet,
  },
  PopoverScrollView: {
    component: t.Popover.ScrollView,
  },
  /* https://tamagui.dev/ui/sheet */
  Sheet: {
    component: t.Sheet,
  },
  SheetOverlay: {
    component: t.Sheet.Overlay,
  },
  SheetFrame: {
    component: t.Sheet.Frame,
  },
  SheetHandle: {
    component: t.Sheet.Handle,
  },
  SheetScrollView: {
    component: t.Sheet.ScrollView,
  },
  /* https://tamagui.dev/ui/tooltip */
  Tooltip: {
    component: t.Tooltip,
  },
  TooltipTrigger: {
    component: t.Tooltip.Trigger,
  },
  TooltipContent: {
    component: t.Tooltip.Content,
  },
  TooltipAnchor: {
    component: t.Tooltip.Anchor,
  },
  /* https://tamagui.dev/ui/accordion */
  Accordion: {
    component: t.Accordion,
  },
  AccordionItem: {
    component: t.Accordion.Item,
  },
  AccordionHeader: {
    component: t.Accordion.Header,
  },
  AccordionTrigger: {
    component: t.Accordion.Trigger,
  },
  AccordionContent: {
    component: t.Accordion.Content,
  },
  /* https://tamagui.dev/ui/group */
  Group: {
    component: t.Group,
  },
  GroupItem: {
    component: t.Group.Item,
  },
  /* https://tamagui.dev/ui/tabs */
  Tabs: {
    component: t.Tabs,
  },
  TabsList: {
    component: t.Tabs.List,
  },
  TabsTrigger: {
    component: t.Tabs.Trigger,
  },
  TabsContent: {
    component: t.Tabs.Content,
  },
  /* https://tamagui.dev/ui/avatar */
  Avatar: {
    component: t.Avatar,
  },
  AvatarImage: {
    component: t.Avatar.Image,
  },
  AvatarFallback: {
    component: t.Avatar.Fallback,
  },
  /* https://tamagui.dev/ui/card */
  Card: {
    component: t.Card,
  },
  CardHeader: {
    component: t.Card.Header,
  },
  CardFooter: {
    component: t.Card.Footer,
  },
  CardBackground: {
    component: t.Card.Background,
  },
  /* https://tamagui.dev/ui/image */
  Image: {
    component: t.Image,
  },
  /* https://tamagui.dev/ui/list-item */
  ListItem: {
    component: t.ListItem,
  },
  ListItemText: {
    component: t.ListItemText,
  },
  ListItemTitle: {
    component: t.ListItemTitle,
  },
  ListItemSubtitle: {
    component: t.ListItemSubtitle,
  },
  /* https://tamagui.dev/ui/separator */
  Separator: {
    component: t.Separator,
  },
  /* https://tamagui.dev/ui/shapes */
  Square: {
    component: t.Square,
  },
  Circle: {
    component: t.Circle,
  },
  /* https://tamagui.dev/ui/anchor */
  Anchor: {
    component: t.Anchor,
  },
  /* https://tamagui.dev/ui/html-elements */
  Section: {
    component: t.Section,
  },
  Article: {
    component: t.Article,
  },
  Main: {
    component: t.Main,
  },
  Header: {
    component: t.Header,
  },
  Aside: {
    component: t.Aside,
  },
  Footer: {
    component: t.Footer,
  },
  Nav: {
    component: t.Nav,
  },
  /* https://tamagui.dev/ui/scroll-view */
  ScrollView: {
    component: t.ScrollView,
  },
  /* https://tamagui.dev/ui/spinner */
  Spinner: {
    component: t.Spinner,
  },
  /*  https://tamagui.dev/ui/unspaced */
  Unspaced: {
    component: t.Unspaced,
  },
  /* https://tamagui.dev/ui/visually-hidden */
  VisuallyHidden: {
    component: t.VisuallyHidden,
  },
  /* https://tamagui.dev/ui/linear-gradient */
  LinearGradient: {
    component: LinearGradient,
  },
  Theme: {
    component: t.Theme,
  },
}
