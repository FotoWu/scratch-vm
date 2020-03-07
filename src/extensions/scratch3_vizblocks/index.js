const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const log = require('../../util/log');
const formatMessage = require('format-message');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');
const AssetType = require('../../../node_modules/scratch-storage/src/AssetType');
const {loadCostume} = require('../../import/load-costume');
const {loadCostumeFromAsset} = require('../../import/load-costume');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';
const assetID = ["64b59074f24d0e2405a509a45c0dadba", "9f75c26aa6c56168a3e5a4f598de2c94","e8d8bf59db37b5012dd643a16a636042",
"57f7afe3b9888cca56803b73a62e4227","b8209e1980475b30ff11e60d7633446d","aacb5b3cec637f192f080138b4ccd8d2",
"84d9f26050c709e6b98706c22d2efb3d","6194b9a251a905d0001a969990961724","55e95fb9c60fbebb7d20bba99c7e9609","0f53ee6a988bda07cba561d38bfbc36f"]

class Scratch3VizBlocks {
    constructor (runtime) {
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penDrawableId = -1;

        /**
         * The ID of the renderer Skin corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penSkinId = -1;


        //initiate canvas and center of coordinate system
        this._xCenter = -100;
        this._yCenter = -100;
        this._width = 200;
        this._height = 200;
        this._interval = 20;

        //initiate position array
        this._xPos = [];
        this._yPos = [];
        this._posEmpty = true;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._onTargetMoved = this._onTargetMoved.bind(this);

        //costumes array
        this._costumes = [];

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.pen';
    }

    /**
     * The default pen state, to be used when a target has no existing pen state.
     * @type {PenState}
     */
    static get DEFAULT_PEN_STATE () {
        return {
            penDown: false,
            color: 66.66,
            saturation: 100,
            brightness: 100,
            transparency: 0,
            _shade: 50, // Used only for legacy `change shade by` blocks
            penAttributes: {
                color4f: [0, 0, 1, 1],
                diameter: 1
            }
        };
    }

    /**
     * When a pen-using Target is cloned, clone the pen state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const penState = sourceTarget.getCustomState(Scratch3PenBlocks.STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Scratch3PenBlocks.STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Handle a target which has moved. This only fires when the pen is down.
     * @param {RenderedTarget} target - the target which has moved.
     * @param {number} oldX - the previous X position.
     * @param {number} oldY - the previous Y position.
     * @param {boolean} isForce - whether the movement was forced.
     * @private
     */
    _onTargetMoved (target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            const penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    /**
     * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
     * the pen Skin doesn't yet exist, create it.
     * @returns {int} the Skin ID of the pen layer, or -1 on failure.
     * @private
     */
    _getPenLayerID () {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {skinId: this._penSkinId});
        }
        return this._penSkinId;
    }

    /**
     * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
     * @private
     */
    _getPenState (target) {
        let penState = target.getCustomState(Scratch3VizBlocks.STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Scratch3VizBlocks.DEFAULT_PEN_STATE);
            target.setCustomState(Scratch3VizBlocks.STATE_KEY, penState);
        }
        return penState;
    }

    getInfo () {
        return {
            id: 'vizblocks',
            name: 'VizBlocks',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'drawAxis',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawAxis',
                        default: 'draw axis',
                        description: 'draw axis'
                    })
                },
                {
                    opcode: 'read',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.read',
                        default: 'read data x:[X] y:[Y]',
                        description: 'read data'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        }
                    }
                },
                {
                    opcode: 'drawLine',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawLine',
                        default: 'draw line',
                        description: 'draw line'
                    })
                },
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.clear',
                        default: 'clear',
                        description: 'clear canvas'
                    })
                },
            ],
        };
    }

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear () {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }

        if(!this._posEmpty){
            this._xPos.length=0;
            this._yPos.length=0;
            this._posEmpty = true;
        }

    }

    /**
     * The pen "pen down" block causes the target to leave pen trails on future motion.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawAxis (args, util) {
        const target = util.target;
        
        console.log("draw axis");
        target.setVisible(false);

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            const penState = this._getPenState(target);
            target.x = this._xCenter + this._width;
            target.y = this._yCenter;
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);            

            for(let i=0;i*this._interval<this._width;i++){
                let interval = i*this._interval;
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter+interval, this._yCenter, this._xCenter+interval, this._yCenter+5);
                this.drawText(this._xCenter+interval, this._yCenter-10, i, target, false);
            }
            
            // console.log(target.getCostumes());
            target.x = this._xCenter;
            target.y = this._yCenter + this._height;
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);
            for(let i=1;i*this._interval<this._height;i++){
                let interval = i*this._interval;
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter+interval, this._xCenter+5, this._yCenter+interval);
                this.drawText(this._xCenter-10, this._yCenter+interval, i, target, true);
            }
            
            // console.log(target.getCostumes().length);
            for(let i=0,j=1;i*this._interval<this._width&&j*this._interval<this._height;i++,j++){
                this.drawText(this._xCenter+i*this._interval, this._yCenter-10, i, target, true);
                this.drawText(this._xCenter-10, this._yCenter+j*this._interval, j, target, true);
            }
            console.log(target.getCostumes().length);
            
            // target.setVisible(false);
            this.runtime.requestRedraw();

        }
    }

    drawText(xPos, yPos, text, target, flag){
        const index = text;
        const runtime = this.runtime;

        console.log("draw text");
        var costumeObject = new Object();
        if(!flag){       
            runtime.storage.load(AssetType.ImageVector, assetID[index]).then(function(asset){
                costumeObject.name = "number"+index;
                costumeObject.dataFormat = 'svg';
                costumeObject.asset = asset;
                loadCostumeFromAsset(costumeObject, runtime).then(function(costume){
                    target.addCostume(costume, index);
                    target.reorderCostume(target.getCostumeIndexByName(costume.name), index);
                });
            });
        }
        
        this.setText(index, target, xPos, yPos);
    }

    setText(index, target, xPos, yPos){
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penStamp(penSkinId, target.drawableID);
            this.runtime.requestRedraw();
        }
        
        target.setCostume(target.getCostumeIndexByName("number"+index));
        if(target.getCurrentCostume().name=='costume2')
            target.setCostume(target.getCostumeIndexByName('costume1'));
        else{
            console.log(target.getCurrentCostume().name);
        }
        target.setXY(xPos, yPos);
        target.setSize(20);
        target.setVisible(true);
    }

    drawLine(args, util){
        var data_x = this._xPos;
        var data_y = this._yPos;
        
        const target = util.target;

        console.log("draw line");

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0 && data_x.length>1 && data_y.length>1) {
            const penState = this._getPenState(target);
            for(let i=0;i<data_x.length;i++){
                this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, data_x[i], data_y[i]);
            }
            for(let i=1;i<data_x.length;i++){
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, data_x[i-1], data_y[i-1], data_x[i], data_y[i]);
            }
            this.runtime.requestRedraw();
        }
    }

    read(args){
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);

        this._xPos.push(this._xCenter + x*20);
        this._yPos.push(this._yCenter + y*20);
        this._posEmpty = false;
    }
}

module.exports = Scratch3VizBlocks;