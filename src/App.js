import './App.css';
import json_ports from './ports.json';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import * as _ from "lodash";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';
import qualities from './qualities.json';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import quests from './quests.json';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const context = require.context('../icons', true, /.png$/);
const images = {};
context.keys().forEach((key) => {
	 const filename = key.split('./').pop() // remove the first 2 characters
    .substring(0, key.length - 6); // remove the file extension
  images[filename] = context(key);
});

const goods = [];
const option_goods = [];
qualities.forEach( quality => {
	if(quality.Category === "Goods"){
		goods[quality.Id] = quality;
		option_goods.push(quality);
	}
});
_.sortBy(option_goods, 'Name');

const option_curiosities = [];
qualities.forEach( quality => {
	if(quality.Category === "Curiosity"){
		goods[quality.Id] = quality;
		option_curiosities.push(quality);
	}
});
_.sortBy(option_curiosities, 'Name');

const option_stories = [];
qualities.forEach( quality => {
	if(quality.Category === "Story"){
		goods[quality.Id] = quality;
		option_stories.push(quality);
	}
});
_.sortBy(option_stories, 'Name');

const option_circumstances = [];
qualities.forEach( quality => {
	if(quality.Category === "Circumstance"){
		goods[quality.Id] = quality;
		option_circumstances.push(quality);
	}
});
_.sortBy(option_circumstances, 'Name');

let  ports = json_ports.ports;
ports = _.sortBy(ports, 'name');

// create our colours for reuse
const primary = 'rgb(220,186,148)';
const secondary = 'rgb(11, 88, 120)';
const white = 'rgb(255,255,255)';
const black = 'rgb(0,0,0)';
const overlay = 'rgb(112,193,233)';
const textField = 'rgba(238, 133, 9, 0.3)';
const gray = 'rgb(222,222,222)';

const theme = createMuiTheme({
  palette: {
	type: 'dark',
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    overlayColor: {
      main: overlay
	},
	black: {
      main: black
	},
	white: {
      main: white
    },
	textField: {
      main: textField
	}
  },
  typography: {
   fontSize: 20,
   fontFamily: "RobotoSlab",
  },
	overrides: {
		MuiPaper:{
			root:{
				backgroundColor: primary,
				fontSize: 20
			}	
		},
		MuiTypography:{
			body1:{
				fontSize: 16
			}
		},
		MuiAccordion:{
			root:{
				fontSize: 25,
				fontWeight: "bold",
				color: 'rgba(50,50,50,255)',
				fontFamily: "RobotoSlab",
			}	
		}
	}
});

const styles = theme => ({
	porticon: { 
		height: 52,
		width: 40
	},
	portname: {
		marginLeft: 10,
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	porticoncontainer:{
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	goodname: {
		fontSize: 16,
		flexGrow: 1,
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	goodicon:{
		width: 40,
		height: 52,
	},
	questrow:{
		width: "100%",
		display: "flex",
		flexDirection: "row",
		marginBottom: 10
	},
	deleteicon:{
		display: "flex",
		alignItems: "center",
		cursor: "pointer"
	},
	links:{
		color: "black",
		textDecoration: "none"
	},
	questcontainer:{
		width: "100%",
		display: "inline-block",
		margin: "0 1rem 1rem 0"
	},
	masonry:{
		columns: "4",
		display: "block",
		columnGap: "1 rem",	
		rowGap: "1 rem"
	},
});


class App extends React.Component <State> {


	constructor(props: any) {
		super(props);
		this.state = { selectedPort: "none", amount: 0, quests: quests , selectedGood: 110135 };
	}	

	handlePortSelect(portname){
		this.setState({selectedPort: portname });
	}

	handleQuestAdd(){
		const currentPort = this.state.selectedPort;
		const currentAmount = this.state.amount;
		const currentGood = this.state.selectedGood;
		if( currentAmount === 0){
			return;
		}	
		this.setState(prevState => ({
			quests: {                  // object that we want to update
				...prevState.quests,    // keep all other key-value pairs
				[currentPort]: prevState.quests[currentPort] !== undefined ? prevState.quests[currentPort].concat([{ good: currentGood, amount: currentAmount }]) : [{ good: currentGood, amount: currentAmount }]
			}
		})); 
	}

	handleAmountChange(e){
		this.setState({amount: e.target.value });
	}	

	handleGoodChange(e){
		this.setState({selectedGood: e.target.value });
	}

	handleQuestRemove(port, quest_index){
		console.log(port);
		console.log(quest_index);
		this.setState(prevState => ({
			quests: {                  // object that we want to update
				...prevState.quests,    // keep all other key-value pairs
				[port]: prevState.quests[port].slice(0, quest_index).concat(prevState.quests[port].slice(quest_index + 1, prevState.quests[port].length))
			}
		})); 
	}

	render(){
		console.log(this.state.quests);
		console.log(this.state.selectedGood);
		const { classes } = this.props;

		return (
		<ThemeProvider theme={theme} >
		<div className="App">
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Paper>
					<Typography>{this.state.selectedPort}</Typography>
					<select onChange={(e) => this.handleGoodChange(e)} >
						{option_goods.map((good, index) =>{
							return <option key={index} value={good.Id}>{good.Name}</option>
						})}
					</select>
					<select onChange={(e) => this.handleGoodChange(e)} >
						{option_curiosities.map((good, index) =>{
							return <option key={index} value={good.Id}>{good.Name}</option>
						})}
					</select>
					<select onChange={(e) => this.handleGoodChange(e)} >
						{option_stories.map((good, index) =>{
							return <option key={index} value={good.Id}>{good.Name}</option>
						})}
					</select>
					<select onChange={(e) => this.handleGoodChange(e)} >
						{option_circumstances.map((good, index) =>{
							return <option key={index} value={good.Id}>{good.Name}</option>
						})}
					</select>
					<TextField id="amount" label="Amount" onChange={(e) => this.handleAmountChange(e)} value={this.state.value} />
					<Button onClick={() => this.handleQuestAdd() } variant="contained" color="primary">
						Add Quest
					</Button>
				</Paper>
			</Grid>
			<Grid item xs={8}>
				<div className={classes.masonry}>
				{ports.map(port => {
				if (this.state.quests[port.name] && this.state.quests[port.name].length > 0){
					return(
					<Paper className={classes.questcontainer}>
					<Accordion defaultExpanded={true} >
						<AccordionSummary>	
							<div className={classes.porticoncontainer}>
								{ port.icon && images[port.icon + "small"] &&
								<img className={classes.porticon} src={images[port.icon + "small"].default} />
								}
							</div>
							<div className={classes.portname}>{ port.name }</div>
						</AccordionSummary>
						<AccordionDetails>
							<Grid container>
							{ this.state.quests[port.name] && 
								this.state.quests[port.name].map((quest, index) =>{
									const good = goods[parseInt(quest.good)];
									
									return (
									<div className={classes.questrow}>
										<div className={classes.goodicon} ><img src={images[good.Image + "small"].default} /></div>
										<div className={classes.goodname}><a target="_blank" className={classes.links} href={"https://sunlesssea.gamepedia.com/" + good.Name}>{ quest.amount} {good.Name}</a></div>
										<div className={classes.deleteicon}><DeleteForeverIcon onClick={() => this.handleQuestRemove(port.name, index)} /></div>
									</div>
									)
								})
							}
							</Grid>
						</AccordionDetails>
					</Accordion>
					</Paper>
					)
				}
				})}
				</div>
			</Grid>
			<Grid item xs={4}>
				<Grid container>
					{ports.map(port => {
						return(
						<Grid onClick={() => this.handlePortSelect(port.name) }  item xs={2}>
							<div></div>	
							{ port.icon && images[port.icon + "small"] &&
								<img src={images[port.icon + "small"].default} />
							}
							<div>{ port.name }</div>
						</Grid>
						)
					})}
				</Grid>
			</Grid>
		</Grid>
		</div>

		</ThemeProvider>
		);
	}
}

export default withStyles(styles)(App);
