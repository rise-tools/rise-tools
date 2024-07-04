export function UI() {
  return [
    {
      $: 'component',
      component: 'View',
      children: [
        {
          $: 'component',
          component: 'Icon',
          props: {
            icon: 'MessageCircleHeart',
          },
        },
        {
          $: 'component',
          component: 'View',
          children: [
            {
              $: 'component',
              component: 'Title',
              children: 'Do you like the App?',
            },
            {
              $: 'component',
              component: 'Button',
              children: 'Send Feedback',
              props: {
                onPress: {
                  $: 'action',
                  action: 'navigate',
                  path: 'delivery/feedbackForm',
                },
              },
            },
          ],
        },
      ],
    },
    {
      $: 'component',
      component: 'Groceries',
    },
    {
      $: 'component',
      component: 'Restaurants',
    },
    {
      $: 'component',
      component: 'Taxis',
    },
  ]
}
