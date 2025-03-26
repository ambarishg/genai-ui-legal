// src/theme/index.js

import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.800')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
      },
    }),
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    mono: 'Menlo, monospace',
  },
  colors: {
    brand: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'sm',
      },
      sizes: {
        md: {
          fontSize: 'sm',
          px: 4,
          py: 3,
        },
        lg: {
          fontSize: 'md',
          px: 6,
          py: 4,
        },
      },
      variants: {
        primary: (props) => ({
          bg: mode('brand.500', 'brand.200')(props),
          color: mode('white', 'gray.800')(props),
          _hover: {
            bg: mode('brand.600', 'brand.300')(props),
          },
          _active: {
            bg: mode('brand.700', 'brand.400')(props),
          },
        }),
        secondary: (props) => ({
          bg: mode('gray.200', 'gray.700')(props),
          color: mode('gray.800', 'whiteAlpha.900')(props),
          _hover: {
            bg: mode('gray.300', 'gray.600')(props),
          },
          _active: {
            bg: mode('gray.400', 'gray.500')(props),
          },
        }),
        outline: (props) => ({
          borderColor: mode('brand.500', 'brand.200')(props),
          color: mode('brand.500', 'brand.200')(props),
          _hover: {
            bg: mode('brand.50', 'brand.800')(props),
          },
          _active: {
            bg: mode('brand.100', 'brand.700')(props),
          },
        }),
      },
      defaultProps: {
        variant: 'primary',
        size: 'md',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    Link: {
      baseStyle: (props) => ({
        color: mode('brand.500', 'brand.200')(props),
        _hover: {
          textDecoration: 'underline',
        },
      }),
    },
  },
});

export default theme;
