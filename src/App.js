import './App.css';
import json_ports from './ports.json';
import savedata from './Autosave.json';
import tilesdata from './Tiles.json';
import areadata from './areadata.json';
import exchangesjson from './exchanges.json';
import eventsjson from './events.json';
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
	goods[quality.Id] = quality;
	if(quality.Category === "Circumstance"){
		option_circumstances.push(quality);
	}
});
_.sortBy(option_circumstances, 'Name');

const qualitiesPossessedList = [];
savedata.QualitiesPossessedList.map(qualityPossessed => {
	const qualityId = qualityPossessed.AssociatedQualityId;
	qualitiesPossessedList[qualityId] = qualityPossessed.Level; 
});

const events = [];
eventsjson.forEach( single_event => {
	events[single_event.Id] = single_event;
	const required = single_event.QualitiesRequired;
	single_event.QualitiesRequired.forEach(quality => {
		if(quality.AssociatedQualityId === 116124){
			// console.log(single_event);
		}
	});
	single_event.QualitiesAffected.forEach(quality => {
		if(quality.AssociatedQualityId === 116124){
			// console.log(single_event);
		}
	});
	if(single_event.Image === "papers5"){
		// console.log(single_event);
	}
	if(single_event.Category === "QuesticleStep, Gold"){
		// events that only happen on your ship
		// console.log(single_event);
	}
	if(single_event.LimitedToArea !== null){
		if(single_event.LimitedToArea.Id === 107690){
			console.log(single_event);
			single_event.ChildBranches.forEach(branch => {
				// check if the qualities required are met
				branch.QualitiesRequired.forEach(quality => {
					const level = qualitiesPossessedList[quality.AssociatedQualityId];
					let minLevel = false;
					let maxLevel = false;
					if(quality.MinLevel === null || quality.MinLevel <= level){
						minLevel = true;
					}
					if(quality.MaxLevel === null || quality.MaxLevel >= level){
						maxLevel = true;
					}
					const requirements_met = minLevel && maxLevel && (minLevel !== null || maxLevel !== null);
					if(requirements_met){
						console.log(branch.Name);
					}
				});
			});
		}
	}
});

goods.forEach( good => {
	if(good.Image === "papers5"){
		// console.log(good);
	}
});

// JSON.stringify(
 // console.log(events[245099]); // what can we do to the letter itself, and its results
// console.log(goods[127591]); // Story
// console.log(goods[127517]); // Story
console.log(goods[127586]); // Progress => Level 1 (letter opened or not)
// console.log(goods[108545]); // increasing fragments
// what is 166852?

/* Prisoner */
// console.log(events[151261]); // questicleStep, gold (called Story on wiki)
/* port report wisdom */
// console.log(goods[116124]);	// quality: do we have one?



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
				fontSize: 15,
			}	
		},
		MuiTypography:{
			body1:{
				fontSize: 16
			}
		},
		MuiAccordion:{
			root:{
				fontSize: 15,
				fontWeight: "bold",
				color: 'rgba(50,50,50,255)',
				fontFamily: "RobotoSlab"
			}	
		},
		MuiAccordionSummary:{
			content:{
				margin: 0,
				"&$expanded":{
					margin: 0
				}
			},
			root:{
				"&$expanded":{
					minHeight: "unset",
				}
			}
		},
	}
});

const styles = theme => ({
	porticon: { 
		height: 52,
		width: 40
	},
	ressources: {
		height: 24,
		width: 24,
		borderRadius: 12,
		objectFit: "cover",
		objectPosition: "0 -5px",
		margin: 2
	},
	commission:{
		height: 24,
		width: 24,
		borderRadius: 12,
		objectFit: "cover",
		objectPosition: "0 -3px",
		margin: 2
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
		marginBottom: 1
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
		margin: "0 1rem 1rem 0",
		"& .Mui-expanded.MuiAccordion-root":{
			zIndex: 1
		}
	},
	masonry:{
		columns: "4",
		display: "block",
		columnGap: "1 rem",	
		rowGap: "1 rem"
	},
	tile: {
		borderRight: "5px solid blue"
	},
	mapRow: {
		borderBottom: "5px solid blue",
		height: "16vh"
	},
	infoIcons: {
		display: "flex",
		paddingTop: 2
	}
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
		this.setState(prevState => ({
			quests: {                  // object that we want to update
				...prevState.quests,    // keep all other key-value pairs
				[port]: prevState.quests[port].slice(0, quest_index).concat(prevState.quests[port].slice(quest_index + 1, prevState.quests[port].length))
			}
		})); 
	}

	render(){
		const { classes } = this.props;
		
		
		// determine the tiles
		const grid = [ [], [], [], [], [], [] ];
		savedata.TileConfig.Tiles.map(tile => {
			let gridY;
			switch(tile.Position.TileIndexY) {
				case 0:
					gridY = 5;
					break;
				case 1:
					gridY = 4;
					break;
				case 2:
					gridY = 3;
				break;
				case 3:
					gridY = 2;
				break;
				case 4:
					gridY = 1;
				break;
				case 5:
					gridY = 0;
				break;
			}
			
			const exchanges = []
			exchangesjson.map(exchange => {
				exchange.SettingIds.map(id => {
					exchanges[id] = exchange;
				});
			});
			
			// fuel: 102027
			// supplies: 	102026
			// check if the exchange sells fuel
			exchanges.map(exchange => {
				exchange.Shops.map(shop => {
					shop.Availabilities.map(avail => {
						if(avail.Quality.Id === 102027){
							exchange.fuel = true;
							exchange.fuel_price = avail.Cost;
							if(avail.PurchaseQuality.Id === 102028){
								exchange.fuel_echoes = true;
							}
						}
						if(avail.Quality.Id === 102026){
							exchange.supplies = true;
							exchange.supply_price = avail.Cost;
							if(avail.PurchaseQuality.Id === 102028){
								exchange.supply_echoes = true;
							}
						}
					});
				});
			});
			
			tilesdata.map(innertile => {
				if(innertile.Tiles[0] !== undefined && innertile.Tiles[0].Name === tile.Name){
					tile.PortData = innertile.Tiles[0].PortData;
					tile.PortData.map(data => {
						switch(data.Name){
							case "FallenLondon":
								data.Name = "Fallen London";
								data.Icon = "fallenlondon_port";
							break;
							case "AbbeyrockPort":
								data.Name = "Abbey Rock";
								data.Icon = "abbeyrock_port";
							break;
							case "AestivalPort":
								data.Name = "Aestival";
								data.Icon = "aestival_port";
							break;
							case "Frostfound Port":
								data.Name = "Frostfound";
								data.Icon = "frostfound_port";
							break;
							case "GodfallPort":
								data.Name = "Godfall";
								data.Icon = "godfall_port";
							break;
							case "Hideaway Port":
								data.Name = "Hideaway";
								data.Icon = "hideaway";
							break;
							case "IronRepublic":
								data.Name = "Iron Republic";
								data.Icon = "ironrepublic";
							break;
							case "KingeaterPort":
								data.Name = "Kingeater's Castle";
								data.Icon = "kingeaterscastle_port";
							break;
							case "LowBarnetZM":
								data.Name = "Low Barnet";
								data.Icon = "lowbarnet";
							break;
							case "MangroveCollege":
								data.Name = "Mangrove College";
								data.Icon = "generic_port";
							break;
							case "MountPalmerston":
								data.Name = "Mount Palmerston";
								data.Icon = "portpalmerston";
							break;
							case "RosegateZM":
								data.Name = "Rosegate";
								data.Icon = "rosegate";
							break;
							case "Scrimshander Port":
								data.Name = "Scrimshander";
								data.Icon = "scrimshander";
							break;
							case "StationIIIPort":
								data.Name = "Station III";
								data.Icon = "stationIII_port";
							break;
							case "Visage":
								data.Name = "Visage";
								data.Icon = "visage_port";
							break;
							case "Wrack Port":
								data.Name = "Wrack";
								data.Icon = "wrack";
							break;
							case "CecilPort":
								data.Name = "Port Cecil";
								data.Icon = "principlesofcoral_port";
							break;
							case "Nuppmiddt Port":
								data.Name = "Wisdom";
								data.Icon = "seaoflilies_port";
							break;
							case "KhansShadow":
								data.Name = "Khan's Shadow";
								data.Icon = "khansshadow_port";
							break;
							case "PortCarnelian":
								data.Name = "Port Carnelian";
								data.Icon = "portcarnelian_port";
							break;
							case "PolythremePort":
								data.Name = "Polythreme";
								data.Icon =  "polythreme";
							break;
							// case "":
								// data.Name = "";
								// data.Icon = "";
							// break;
							default:
							break;
						}
						data.exchange = exchanges[data.Setting.Id];
						return data;
					});
				}
			});
			grid[gridY][tile.Position.TileIndexX] = tile;
		});
		
		
		// get the info about all comissions
		// 102328
		const desc = goods[102328].LevelDescriptionText;
		const commissions = []
		const split1 = desc.split("~");
		split1.map(split => {
			const split2 = split.split("|");
			commissions[split2[0]] = [split2[1]];
		});
		
		// determine which port reports we have
		const port_reports = [];
		let echoes = 0;
		let commission;
		savedata.QualitiesPossessedList.map(qualityPossessed => {
			const qualityId = qualityPossessed.AssociatedQualityId;
			const level = qualityPossessed.Level;
			if(qualityId === 102028){
				echoes = level;
			}
			if(qualityId === 102328){
				commission = commissions[level].toString();
			}
			if(level === 0){
				// we dont actually possess this
				return;
			}
			const quality = goods[qualityId];
			if(quality !== undefined && quality.Name.includes("Port Report")){
				port_reports.push(quality.Image);
			} 

		});

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
			<div>
			Echoes: {echoes} <br></br>
			Commission: {commission}</div>
			{ grid.map(row =>{
				return (
					<Grid container classes={{ root: classes.mapRow}} >
						{ row.map(tile =>{
							return (
								<Grid classes={{ root: classes.tile }} item xs={2}>
										{tile.PortData !== undefined && tile.PortData.map(data => {
											return (
												<Paper className={classes.questcontainer}>
													<Accordion defaultExpanded={false} >
														<AccordionSummary>	
															<div className={classes.porticoncontainer}>
																{ data.Icon && images[data.Icon + "small"] &&
																<img className={classes.porticon} src={images[data.Icon + "small"].default} />
																}
															</div>
															<div className={classes.portname}>{data.Area.Id}{ data.Name }</div>
															<div className={classes.infoIcons}>
																{ data.exchange && data.exchange.fuel &&
																	<div>																	<img className={classes.ressources} src={images["fuelsmall"].default} /><div className={classes.infoPrice}>{
																		data.exchange.fuel_echoes ? 
																		data.exchange.fuel_price : "!" }</div>

																	</div>
																}
																{ data.exchange && data.exchange.supplies &&
																	<div><img className={classes.ressources} src={images["suppliessmall"].default} /><div className={classes.infoPrice}>{
																		data.exchange.supply_echoes ? 
																		data.exchange.supply_price : "!" }</div>
																	
																	</div>
																}
																{ port_reports.includes(data.Icon) && <img className={classes.ressources} src={images["paperstacksmall"].default} />  }
																{ commission.includes(data.Name) && <img className={classes.commission} src={images["papers5small"].default} />}
															</div>
														</AccordionSummary>
														<AccordionDetails>
															<Grid container>
															{ this.state.quests[data.Name] && 
																this.state.quests[data.Name].map((quest, index) =>{
																	const good = goods[parseInt(quest.good)];
																	
																	return (
																	<div className={classes.questrow}>
																		<div className={classes.goodicon} ><img src={images[good.Image + "small"].default} /></div>
																		<div className={classes.goodname}><a target="_blank" className={classes.links} href={"https://sunlesssea.gamepedia.com/" + good.Name}>{ quest.amount} {good.Name}</a></div>
																		<div className={classes.deleteicon}><DeleteForeverIcon onClick={() => this.handleQuestRemove(data.Name, index)} /></div>
																	</div>
																	)
																})
															}
															</Grid>
														</AccordionDetails>
													</Accordion>
												</Paper>)
										})}
								</Grid>);
						})}
					</Grid>
				);
			})}
		</Grid>
		</div>

		</ThemeProvider>
		);
	}
}

export default withStyles(styles)(App);
