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
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

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
});

const interactions = [];
const linkEvents = [];

const port_report_qualities = [];

const debug_events = false;

// in a first pass, determine the linkEvents, so that we know which quests in limbo can be displayed
eventsjson.forEach( single_event => {
	let requirements_met = "";
	if( single_event.QualitiesRequired.length === 0){
		// if there are no requirements, they are met
		requirements_met = true;
	} else {
		single_event.QualitiesRequired.forEach(quality => {
			if(requirements_met === ""){
				requirements_met = checkIfQualityFulfilled(quality, qualitiesPossessedList[quality.AssociatedQualityId], true);
			} else {
				requirements_met = checkIfQualityFulfilled(quality, qualitiesPossessedList[quality.AssociatedQualityId], true) && requirements_met;
			}
		});
	}
	if(!requirements_met){
		return;
	}
	if(single_event.LimitedToArea !== null){
		let limitedto = single_event.LimitedToArea.Id;
		single_event.ChildBranches.forEach(branch => {
			let requirements_met = "";
			// if(branch.Name === "Entertain your crew's terrified speculations"){
				branch.QualitiesRequired.forEach(quality => {			
					const level = qualitiesPossessedList[quality.AssociatedQualityId];
					if(requirements_met === ""){
						requirements_met = checkIfQualityFulfilled(quality, level, true);
						if(requirements_met){
							if(debug_events) console.log("first required quality possessed");
						} else {
							if(debug_events) console.log("first required quality not possessed");
							if(debug_events) console.log(quality);
							if(debug_events) console.log(level);
						}
					} else {
						requirements_met = checkIfQualityFulfilled(quality, level, true) && requirements_met;
						if(requirements_met){
							if(debug_events) console.log("further required quality possessed");
						} else {
							if(debug_events) console.log("further required quality not possessed");
							if(debug_events) console.log("quality:");
							if(debug_events) console.log(quality);
							if(debug_events) console.log("level: " + level);
						}
					}
				});
				
				
				// check for linked events, that are actually assigned to limbo and wouldnt show up because of that
				if(branch.DefaultEvent !== undefined && branch.DefaultEvent.LinkToEvent !== null){
					const linkEvent = events[branch.DefaultEvent.LinkToEvent.Id];
					// let the limbo task know if the requirements of its parent task are fulfilled
					linkEvents[linkEvent.Id] = requirements_met;
					
				} 
			//}
		});
	}
});


eventsjson.forEach( single_event => {

	
	if(single_event.Image === "papers5"){
		// console.log(single_event);
	}
	if(single_event.Category === "QuesticleStep, Gold"){
		// events that only happen on your ship
		// console.log(single_event);
	}

	let requirements_met = "";
	if( single_event.QualitiesRequired.length === 0){
		// if there are no requirements, they are met
		requirements_met = true;
	} else {
		single_event.QualitiesRequired.forEach(quality => {
			if(requirements_met === ""){
				requirements_met = checkIfQualityFulfilled(quality, qualitiesPossessedList[quality.AssociatedQualityId], true);
			} else {
				requirements_met = checkIfQualityFulfilled(quality, qualitiesPossessedList[quality.AssociatedQualityId], true) && requirements_met;
			}
		});
	}
		
	if(!requirements_met){
		return;
	}
	if(single_event.LimitedToArea !== null){
		
		
		let limitedto = single_event.LimitedToArea.Id;
		single_event.ChildBranches.forEach(branch => {
			// this is not the best way of determining port report qualities
			// preferably, we would gather all qualities that have "port report" in their name
			// then we would check events, to see whether they affect a port report quality
			// if they do, we then know that the port report is linked to that port
			if(branch.Name.includes("Port Report") 
			|| branch.Name.includes("Gather intelligence")
			|| branch.Name.includes("Chat to the port-folk")
			|| branch.Name.includes("Gather gossip")
			){
				if(port_report_qualities[limitedto] === undefined){
					port_report_qualities[limitedto] = [];
				}
				if(branch.SuccessEvent !== null){
					port_report_qualities[limitedto].push(branch.SuccessEvent.QualitiesAffected[0].AssociatedQualityId);
				} else {
					port_report_qualities[limitedto].push(branch.DefaultEvent.QualitiesAffected[0].AssociatedQualityId);
				}
				// console.log({branch});
			}
			
			// console.log("...");
			// check if the qualities required are met
			let requirements_met = "";
				
			const branchname = branch.Name;
			// console.log({ branchname });	
			// console.log({ branch});	
				
			// check if the 	
				

			// if(branch.Name === "Entertain your crew's terrified speculations"){
				branch.QualitiesRequired.forEach(quality => {			
					const level = qualitiesPossessedList[quality.AssociatedQualityId];
					if(requirements_met === ""){
						requirements_met = checkIfQualityFulfilled(quality, level, true);
						if(requirements_met){
							if(debug_events) console.log("first required quality possessed");
						} else {
							if(debug_events) console.log("first required quality not possessed");
							if(debug_events) console.log(quality);
							if(debug_events) console.log(level);
						}
					} else {
						requirements_met = checkIfQualityFulfilled(quality, level, true) && requirements_met;
						if(requirements_met){
							if(debug_events) console.log("further required quality possessed");
						} else {
							if(debug_events) console.log("further required quality not possessed");
							if(debug_events) console.log("quality:");
							if(debug_events) console.log(quality);
							if(debug_events) console.log("level: " + level);
						}
					}
				});
				
				if(requirements_met){
					if(branch.Name === "A collector"){
						// parent event has no requirements, has id 181952, limited to limbo
					}
					// if we are on a limbo quest, we need to check if we've actually been sent here
					// if we just redirect every quest to the parent location, we ignore the requirements of their parent quest
					if( limitedto === 101956 && branch.DefaultEvent.LinkToEvent !== null){
						const linkEvent = events[branch.DefaultEvent.LinkToEvent.Id];
						const linkName = linkEvent.Name;
						
						if(linkEvent.LimitedToArea !== null && linkEvents[single_event.Id]){
							limitedto = linkEvent.LimitedToArea.Id;
						}
					}
					if(interactions[limitedto] === undefined){
						interactions[limitedto] = [branch];
					} else {
						interactions[limitedto].push(branch);
					}
				} else {
					const branchName = branch.Name;
					if(debug_events) console.log("rejecting quest: ");
					if(debug_events) console.log({ branchName  });
				}
				
				
							//}
		});
	}
});

function sort_quests(quests){
	const sorted_quests = { locked: [], unlocked:[]};
	// types we want to catch: SAY, Repeatable (?), Locked, Unlocked
	if(quests !== undefined){
		quests.forEach(quest => {
			let requirements_met = "";
			if(quest.QualitiesRequired.length === 0){
				requirements_met = true;
			}
			quest.QualitiesRequired.map(quality => { 
				if( goods[quality.AssociatedQualityId] !== undefined){
					const associatedQualityId = quality.AssociatedQualityId;
					const level = qualitiesPossessedList[associatedQualityId] !== undefined ? qualitiesPossessedList[associatedQualityId] : 0;
					if(requirements_met === ""){
						requirements_met = checkIfQualityFulfilled(quality,level,false);
					} else {
						requirements_met = checkIfQualityFulfilled(quality,level,false) && requirements_met;
					}
				}
			});
			if(requirements_met){
				sorted_quests.unlocked.push(quest);
			} else {
				sorted_quests.locked.push(quest);
			}
		});
	}
	return sorted_quests;
}

const ShadowyWorkinKhansHeart = qualitiesPossessedList[146643];
// console.log({ ShadowyWorkinKhansHeart });

function checkIfQualityFulfilled(quality, level, forDisplay = false){
	
	// if we only want to know whether the quest is displayed, we can return true for non-hidden quests
	// if we want to know whether the quest can actually be completed, we must be more strict
	if( quality.VisibleWhenRequirementFailed && forDisplay){
		return true;
	}
	
	let minLevel = false;
	let maxLevel = false;
	if(quality.MinLevel === null || quality.MinLevel <= level){
		minLevel = true;
	}
	if(quality.MaxLevel === null || quality.MaxLevel >= level){
		maxLevel = true;
	}
	if(level === undefined){
		if(quality.MaxLevel === 0){
			return true;
		}
		return false;
	}
	let requirements_met = minLevel && maxLevel && (minLevel !== null || maxLevel !== null);

	return requirements_met;
}

// console.log(goods[126174]);
// console.log(qualitiesPossessedList[128593]);

const limbo = interactions[101956];
// console.log({limbo});


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
	required: {
		height: 24,
		margin: 2,
		border: "1px solid black"
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
	list:{
		paddingInlineStart: 10,
	},
	questrow:{
		width: "100%",
		flexDirection: "row",
		marginBottom: 1,
		textAlign: "left",
		paddingBottom: 10,
		borderBottom: "1px solid black"
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
		margin: "0 0 0 0",
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
	},
	questcounter:{
		fontWeight: "bold",
	},
	notPossessed:{
		opacity: 0.6,
		border: "1px solid red"
	},
	questtitle:{
		fontWeight: "bold",
		color: "black"
	},
	questdescription:{
		fontSize: 12
	},
	questicons:{
		textAlign: "end"
	},
	locked:{
		color: "red",
	},
	unlocked: {
		color: "green"
	}
});



const QuestCounter = (props) => {
	const {interactions, classes} = props;
	const sorted_quests = sort_quests(interactions);
	if(sorted_quests){
			return (
			<div className={classes.questcounter}>
				<span className={classes.unlocked}>
					{sorted_quests.unlocked.length}
				</span>
				/
				<span className={classes.locked}>
					{sorted_quests.locked.length}
				</span>
				&nbsp;
			</div>
			
			)										
	} else {
		return (<div></div>)
	}
}

const QuestRow = (props) => {
	const {classes, quest} = props;
	let requirements = [];
	quest.QualitiesRequired.map(quality => { 
		if( goods[quality.AssociatedQualityId] !== undefined){
			const associatedQualityId = quality.AssociatedQualityId;
			const level = qualitiesPossessedList[associatedQualityId] !== undefined ? qualitiesPossessedList[associatedQualityId] : 0;
			const qualityDetails = goods[associatedQualityId];
			let amountNeeded;
			if(quality.MinLevel !== null){
				if(quality.MaxLevel !== null){
					amountNeeded = "more than " + quality.MinLevel + " and less than " + quality.MaxLevel;
				} else {
					amountNeeded = quality.MinLevel;
				}
			} else if(quality.MaxLevel !== null){
				if(quality.MaxLevel === 0){
					amountNeeded = "no ";
				} else {
					amountNeeded = "no more than " + quality.MaxLevel;
				}
			} else {
				amountNeeded = "any? ";
			}
			requirements.push(
				{
					"src": images[qualityDetails.Image + "small"].default,
					"notPossessed" : ! checkIfQualityFulfilled(quality, level, false),
					amountNeeded: amountNeeded,
					amountPossessed: level,
					quality: qualityDetails.Name
				}
			);
		}
	});
	// {clsx(classes.avatar, { [classes.avatarSelected]: data === option.value,})}
	return (
	<li className={classes.questrow}>
		<div className={classes.questtitle}>{ quest.Name }</div>
		<div className={classes.questdescription}>{quest.Description}</div>
		<div className={classes.questicons}>{ requirements.map(req => {
				const unlock = req.amountNeeded + " " + req.quality + " (you have " + req.amountPossessed + ")";
				return <Tooltip title={"Unlocked with " + unlock}><img className={clsx(classes.required, { [classes.notPossessed]: req.notPossessed })} src={req.src} /></Tooltip>
			}) 
		}
		</div>
	</li>
	
	);
}

/* 

		/* { quest.QualitiesRequired.map(quality => { 
			
		});
		}	*/

class App extends React.Component{


	constructor(props) {
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
							case "FieldhavenPort":
								data.Name = "Shepherd's Isles";
								data.Icon = "generic_port";
							break;
							case "DemeauxIsland":
								data.Name = "Iron & Misery Co. Funging Station";
								data.Icon = "demeauxisland_port";
							break;
							case "Dahut Port":
								data.Name = "Dahut";
								data.Icon = "dahut";
							break;
							case "ZeelPort":
								data.Name = "The Salt Lions";
								data.Icon = "saltlions_port";
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
		
		let echoes = 0;
		let commission;
		let something_awaits_you;
		savedata.QualitiesPossessedList.map(qualityPossessed => {
			const qualityId = qualityPossessed.AssociatedQualityId;
			const level = qualityPossessed.Level;
			if(qualityId === 102028){
				echoes = level;
			}
			if(qualityId === 102328){
				commission = commissions[level].toString();
			}
			if(qualityId === 102973){
				something_awaits_you = level;
			}
			if(level === 0){
				// we dont actually possess this
				return;
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
			<div>Echoes: {echoes}</div>
			<div>Commission: {commission}</div>
			<div>SAY: {something_awaits_you}</div>
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
															<div className={classes.portname}>
															<QuestCounter classes={classes} interactions={interactions[data.Area.Id]} />
															{ data.Name } {data.Area.Id}   
															</div>
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
																{ port_report_qualities[data.Area.Id] && port_report_qualities[data.Area.Id].map(quality => {
																	if( qualitiesPossessedList[quality] === 1){
																		return (<img className={classes.ressources} src={images["paperstacksmall"].default} />);
																	}
																}) 
																}
																{ commission.includes(data.Name) && <img className={classes.commission} src={images["papers5small"].default} />}
															</div>
														</AccordionSummary>
														<AccordionDetails>
															<Grid container>
																<ul className={classes.list} >
															{ interactions[data.Area.Id] && 
																 interactions[data.Area.Id].map((quest) =>{
																	return <QuestRow goods={goods} classes={classes} quest={quest} />
																})
															}																										
																</ul>
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
