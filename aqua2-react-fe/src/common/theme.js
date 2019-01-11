import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

export const theme = createMuiTheme({
	typography: {
		useNextVariants: true
	},
	palette: {
		primary: { main: green["A400"] },
		secondary: { main: green["A100"] }
	},
	overrides: {
		MuiListItem: {
			root: {
				"&:hover": {
					backgroundColor: green["A100"] + " !important"
				}
			}
		},
		MUIDataTableBodyRow: {
			root: {
				"&:hover": {
					backgroundColor: green["A100"] + " !important"
				}
			}
		},
		MuiButtonBase: {
			root: {
				"&:hover": {
					backgroundColor: green["A100"] + " !important"
				}
			}
		}
	}
});

export default theme;
