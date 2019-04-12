import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
	palette: {
		primary: { main: process.env.REACT_APP_PRIMARY_COLOUR || green['A400'] },
		secondary: { main: process.env.REACT_APP_SECOND_COLOUR || green['A100'] },
	},
	overrides: {
		MuiListItem: {
			root: {
				'&:hover': {
					backgroundColor:
						(process.env.REACT_APP_SECOND_COLOUR || green['A100']) +
						' !important',
				},
			},
		},
		MUIDataTableBodyRow: {
			root: {
				'&:hover': {
					backgroundColor:
						(process.env.REACT_APP_SECOND_COLOUR || green['A100']) +
						' !important',
				},
			},
		},
		MuiTableRow: {
			root: {
				'&:hover': {
					backgroundColor:
						(process.env.REACT_APP_SECOND_COLOUR || green['A100']) +
						' !important',
				},
			},
		},
		MuiButtonBase: {
			root: {
				'&:hover': {
					backgroundColor:
						(process.env.REACT_APP_SECOND_COLOUR || green['A100']) +
						' !important',
				},
			},
		},
	},
});

export default theme;
