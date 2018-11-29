import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export const theme = createMuiTheme({
	typography: {
		useNextVariants: true
	},
	palette: {
		primary: { light: green['A400'], main: green['A700'], dark: green['500'] }
	}
});

export default theme;
