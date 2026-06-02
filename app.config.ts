export default defineAppConfig({
  ui: {
    button: {
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'dark:bg-accent dark:hover:bg-accent/80 dark:active:bg-accent/80 dark:disabled:bg-accent dark:aria-disabled:bg-accent dark:focus-visible:outline-accent',
        },
        {
          color: 'primary',
          variant: 'ghost',
          class: 'dark:text-white dark:hover:bg-white/10 dark:active:bg-white/10',
        },
        {
          color: 'primary',
          variant: 'outline',
          class: 'dark:text-white dark:ring-white/30 dark:hover:bg-white/10',
        },
        {
          color: 'primary',
          variant: 'soft',
          class: 'dark:text-white dark:bg-white/10 dark:hover:bg-white/15',
        },
      ],
    },
  },
})
