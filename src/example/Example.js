require('./socketTest/socketTest');

import socketTest from './socketTest/socketTest';
import React from 'react';
import {FlipCardBoard} from 'flip-card-game-component';
import {FlipCardGame, flipCardGameEvents} from 'flip-card-game';
import 'flip-card-game-component/dist/style.css';

const game = new FlipCardGame();
const gamePlayers = game.getPlayers();
const gameCards = game.getCards();

function generateCards(nativeGameGards) {
    return nativeGameGards.map(function (nativeGameCard) {
        return {
            flipped: nativeGameCard.getState() !== 'back',
            id: nativeGameCard.getId(),
            image: nativeGameCard.getPairId()
        };
    });
}

export default class Example extends React.Component {

    updateCardsAndComponent(data) {
        game.flipCard({
            cardId: data.cardId,
            playerId: data.playerId
        });

        this.setState({
            cards: generateCards(gameCards)
        })
    }

    constructor(props) {
        super(props);

        const that = this;

        socketTest.on('playerAssign', function (data) {
            that.setState({
                currentPlayer: gamePlayers[data.playerId]
            })
        });

        socketTest.on('playerMove', function (data) {
            console.log('RECEIVED INOUT playerMove', data);
            that.updateCardsAndComponent(data);
        });

        //game.on(flipCardGameEvents.CARD_FLIP_EVENT, renderCards);
        //game.on(flipCardGameEvents.PLAYER_MISSED_PAIR_EVENT, function () {
        //    //render with delay so that user can see mistake
        //    setTimeout(renderCards, 1000);
        //});
        //game.on(flipCardGameEvents.GAME_OVER_EVENT,
        //    (data) => alert(`Game over, winner: ${data.winner.getId()}`)
        //);

        this.state = {
            players: gamePlayers,
            currentPlayer: undefined,
            cards: generateCards(gameCards)
        };

        this.onCardClickHandler = this.onCardClickHandler.bind(this);
        this.onPlayerChangeHandler = this.onPlayerChangeHandler.bind(this);
    }

    onCardClickHandler(cardData) {
        const playerMove = {
            cardId: cardData.id,
            playerId: this.state.currentPlayer.getId()
        };

        socketTest.playerMove(playerMove);
        this.updateCardsAndComponent(playerMove);
    }

    onPlayerChangeHandler(e) {
        this.setState(Object.assign(
            this.state, {
                currentPlayer: gamePlayers.find(
                    (player) => player.getId() === e.target.value
                )
            }
        ));
    }

    render() {
        var playerSelectionComponent;
        if (typeof this.state.currentPlayer !== 'undefined') {
            const playersNodes = this.state.players.map(function (player) {
                const playerId = player.getId();
                return <option value={playerId}
                               key={playerId}>
                    {playerId}
                </option>
            });

            playerSelectionComponent = <div>
                Current player:
                <select
                    defaultValue={this.state.currentPlayer.getId()}
                    onChange={this.onPlayerChangeHandler}>
                    {playersNodes}
                </select>
            </div>
        }

        return (
            <div>
                {playerSelectionComponent}
                <FlipCardBoard
                    cards={this.state.cards}
                    onCardClick={this.onCardClickHandler}/>
            </div>
        );
    }
}