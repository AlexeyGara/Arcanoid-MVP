/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid-MVP
 * File: LevelBuilder.ts
 * Path: src/game/
 * Author: alexeygara
 * Last modified: 2026-02-28 02:23
 */

//TODO: move this dependencies to pixi's platform
import {
	PixiAssets,
	PixiContainer,
	PixiNineSliceSprite,
	PixiSprite
}                                from "@pixi/index";
import { ViewState }             from "game/logic/ecs";
import type { WorldFlow }        from "game/logic/ecs/WorldFlow";
import type { WorldFlowContext } from "game/logic/ecs/WorldFlowContext";

const CHILDREN_SCALE = 0.5;

export class LevelBuilder {

	private _flowControl:WorldFlow;
	private _root:PixiContainer;
	private _levelOptions:WorldFlowContext['gamefield'];

	constructor(
		flowControl:WorldFlow,
		root:PixiContainer,
		levelOptions:WorldFlowContext['gamefield']
	) {
		this._flowControl  = flowControl;
		this._root         = root;
		this._levelOptions = levelOptions;
	}

	async load():Promise<void> {

		await PixiAssets.load({ alias: "pack", src: "./assets/pack.json" });
	}

	build():void {

		const stage = new PixiContainer();
		stage.scale = 1;//0.5;

		this._createBorders(stage);

		const boardLayer = new PixiContainer();
		boardLayer.y     = 560;
		stage.addChild(boardLayer);
		this._createBoard(boardLayer);

		const ballLayer = new PixiContainer();
		stage.addChild(ballLayer);
		this._createBall(ballLayer);

		const blocksLayer = new PixiContainer();
		stage.addChild(blocksLayer);
		this._createBlocks(blocksLayer);

		this._root.addChild(stage);
	}

	private _createBoard(stage:PixiContainer):void {

		const board                   = new PixiContainer({ scale: CHILDREN_SCALE });
		const sheet                   = PixiAssets.get("pack");
		const texture                 = sheet?.textures["game/board.png"];
		const originSize:Size<number> = { width: texture.width, height: texture.height };
		console.log(originSize);
		const sprite = new PixiSprite(texture);
		board.addChild(sprite);

		//sprite.texture = sheet?.textures["game/board : active.png"];

		stage.addChild(board);

		board.pivot.x = originSize.width / 2;
		board.pivot.y = originSize.height / 2;
		board.x       = 400;

		this._flowControl.addBoard(
			board, {
				x: board.x,
				y: board.y + stage.y
			},
			({ posX, posY }) => {
				board.x = posX;
				board.y = posY - stage.y;
			},
			(mode:ViewState) => {
				switch(mode) {
					case ViewState.NORMAL:
						sprite.texture = sheet?.textures["game/board.png"];
						break;

					case ViewState.ACTIVE:
						sprite.texture = sheet?.textures["game/board : active.png"];
						break;
				}
			}
		);
	}

	private _createBall(stage:PixiContainer):void {

		const ball                    = new PixiContainer({ scale: CHILDREN_SCALE });
		const sheet                   = PixiAssets.get("pack");
		const texture                 = sheet?.textures["game/ball.png"];
		const originSize:Size<number> = { width: texture.width, height: texture.height };
		console.log(originSize);
		const sprite = new PixiSprite(texture);
		ball.addChild(sprite);

		//sprite.texture = sheet?.textures["game/ball : active.png"];

		stage.addChild(ball);

		ball.pivot.x = originSize.width / 2;
		ball.pivot.y = originSize.height / 2;
		ball.x       = 400;
		ball.y       = 560;

		this._flowControl.addBall(ball, (mode:ViewState) => {
			switch(mode) {
				case ViewState.NORMAL:
					sprite.texture = sheet?.textures["game/ball.png"];
					break;

				case ViewState.ACTIVE:
					sprite.texture = sheet?.textures["game/ball : active.png"];
					break;
			}
		});

	}

	private _createBorders(stage:PixiContainer):void {
		// left border
		//this._flowControl.addBorder(1, 600 / 2, 100, 600);
		// right border
		//this._flowControl.addBorder(799, 600 / 2, 100, 600);
		// top border
		//this._flowControl.addBorder(800 / 2, 1, 800, 100);
		// bottom border
		//this._flowControl.addBorder(800 / 2, 599, 800, 100);

		const border  = new PixiContainer({ scale: CHILDREN_SCALE });
		const sheet   = PixiAssets.get("pack");
		const texture = sheet?.textures["game/border9.png"];
		const border9 = new PixiNineSliceSprite({
													texture:      texture,
													leftWidth:    24,
													topHeight:    24,
													rightWidth:   24,
													bottomHeight: 24,
													width:        (this._levelOptions.area.width + 24 - 6 * 2) /
																  CHILDREN_SCALE,
													height:       (this._levelOptions.area.height + 24 - 6 * 2) /
																  CHILDREN_SCALE,

												});
		border.x      = 12 + 6;
		border.y      = 12 + 6;
		border.addChild(border9);
		stage.addChild(border);
	}

	private _createBlocks(stage:PixiContainer):void {

		const blocks:PixiContainer[] = [];
		const sprites:PixiSprite[]   = [];
		const texPacks:string[][]    = [];

		const sheet        = PixiAssets.get("pack");
		const textureNames = [["game/block-special-red-hight.png", "game/block-red.png", "game/block-special-red.png"],
							  ["game/block-special-hight.png", "game/block-regular.png", "game/block-special.png"],
							  ["game/block-strong-hight.png", "game/block-regular.png", "game/block-strong.png"]];

		const cols      = 9;
		const rows      = 3;
		const spacingX  = 0;
		const spacingY  = 0;
		let blockWidth  = 0;
		let blockHeight = 0;
		const startX    = 0;
		const startY    = 0;

		const getRandomBlock = ():[PixiContainer, PixiSprite, string[]] => {
			const block                   = new PixiContainer({ scale: CHILDREN_SCALE });
			const texturePack             = textureNames[(textureNames.length * Math.random()) | 0];
			const texture                 = sheet.textures[texturePack[0]];
			const originSize:Size<number> = { width: texture.width, height: texture.height };
			const sprite                  = new PixiSprite(texture);
			block.addChild(sprite);
			block.pivot.x = originSize.width / 2;
			block.pivot.y = originSize.height / 2;

			blockWidth ||= originSize.width * CHILDREN_SCALE;
			blockHeight ||= originSize.height * CHILDREN_SCALE;

			stage.addChild(block);
			return [block, sprite, texturePack];
		};

		for(let i = 1; i <= cols * rows; i++) {
			const [block, sprite, textures] = getRandomBlock();
			blocks.push(block);
			sprites.push(sprite);
			texPacks.push(textures);
		}

		//const layout = new Layout({ target: stage });
		//layout.setStyle({
		//					display: 'flex',
		//					//flexWrap:       'wrap',   // Перенос на новую строку
		//					flexDirection:  'row', // В ряд
		//					justifyContent: 'center', // По центру
		//					alignItems:     'center',
		//					gap:            20, // Отступ между спрайтами
		//					padding:        10,
		//					//width:          500,         // Ширина контейнера, в которую вписываем
		//					width:  '100%',
		//					height: '100%'
		//				});

		for(let i = 0; i < blocks.length; i++) {
			const col = i % cols;    // Номер колонки (0, 1, 2, 3, 4)
			const row = Math.floor(i / cols); // Номер строки

			blocks[i].x = blockWidth / 2 + startX + col * (blockWidth + spacingX);
			blocks[i].y = blockHeight / 2 + startY + row * (blockHeight + spacingY);
		}

		stage.x = this._levelOptions.area.x + this._levelOptions.area.width / 2 - stage.width / 2;
		stage.y = this._levelOptions.area.y + stage.height;

		for(const block of blocks) {
			this._flowControl.addBlock(
				stage.x + block.x,
				stage.y + block.y,
				blockWidth, blockHeight,
				(mode:ViewState) => {
					const index = blocks.indexOf(block);
					switch(mode) {
						case ViewState.NORMAL:
							sprites[index].texture = sheet.textures[texPacks[index][2]];
							break;

						case ViewState.ACTIVE:
							sprites[index].texture = sheet.textures[texPacks[index][1]];
							break;

						case ViewState.DESTROY:
							block.removeFromParent();
					}
				});
		}
	}
}