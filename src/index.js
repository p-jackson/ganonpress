import { registerBlockType } from '@wordpress/blocks';
import { __ as translate } from '@wordpress/i18n';
import { createRef, useState } from '@wordpress/element';

const __ = ( text ) => translate( text, 'ganonpress' );

const BRUSH_URL = '/wp-content/plugins/ganonpress/brush.png';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'ganonpress/draw', {
	/**
	 * This is the display title for your block, which can be translated with `i18n` functions.
	 * The block inserter will show this name.
	 */
	title: __( 'GanonPress Draw' ),

	/**
	 * This is a short description for your block, can be translated with `i18n` functions.
	 * It will be shown in the Block Tab in the Settings Sidebar.
	 */
	description: __(
		'Draw a picture for your visitors using the GanonBrush',
		'ganonpress'
	),

	/**
	 * Blocks are grouped into categories to help users browse and discover them.
	 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
	 */
	category: 'widgets',

	/**
	 * An icon property should be specified to make it easier to identify a block.
	 * These can be any of WordPress’ Dashicons, or a custom svg element.
	 */
	icon: 'admin-customizer',

	/**
	 * Optional block extended support features.
	 */
	supports: {
		// Removes support for an HTML mode.
		html: false,
	},

	attributes: {
		positions: {
			type: 'array',
			default: [],
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
	 *
	 * @param {Object}   [props]             Properties passed from the editor.
	 * @param {Function} props.setAttributes
	 * @param {string}   props.className
	 * @param {Object}   props.attributes
	 *
	 * @return {WPElement} Element to render.
	 */
	edit( { setAttributes, className, attributes } ) {
		return (
			<Clicker
				className={ className }
				addStroke={ ( x, y ) =>
					setAttributes( {
						positions: [ ...attributes.positions, { x, y } ],
					} )
				}
			>
				<Canvas positions={ attributes.positions } />
			</Clicker>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by the block editor into `post_content`.
	 *
	 * @param {Object} [root0]
	 * @param {Object} root0.attributes
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
	 *
	 * @return {WPElement} Element to render.
	 */
	save( { attributes } ) {
		return (
			<div>
				<Canvas positions={ attributes.positions } />
			</div>
		);
	},
} );

function Canvas( { positions } ) {
	return (
		<>
			{ positions.map( ( { x, y }, index ) => (
				<img
					alt=""
					key={ index }
					className="wp-block-ganonpress-draw-brush"
					src={ BRUSH_URL }
					style={ { left: `${ x * 100 }%`, top: `${ y * 100 }%` } }
				/>
			) ) }
		</>
	);
}

function Clicker( { children, className, addStroke } ) {
	const [ mouseDown, setMouseDown ] = useState( false );

	const offset = createRef();
	const getOffset = ( el ) => {
		if ( el ) {
			const { x, y, width, height } = el.getBoundingClientRect();
			offset.current = { x, y, width, height };
		}
	};

	const handlePointerMove = ( e ) => {
		if ( ! mouseDown ) {
			return;
		}

		const x = ( e.clientX - offset.current.x ) / offset.current.width;
		const y = ( e.clientY - offset.current.y ) / offset.current.height;
		addStroke( x, y );
	};

	const handlePointerDown = ( e ) => {
		e.target.setPointerCapture( e.pointerId );
		setMouseDown( true );

		const x = ( e.clientX - offset.current.x ) / offset.current.width;
		const y = ( e.clientY - offset.current.y ) / offset.current.height;
		addStroke( x, y );
	};

	const handlePointerUp = ( e ) => {
		e.target.releasePointerCapture( e.pointerId );
		setMouseDown( false );
	};

	return (
		<div
			ref={ getOffset }
			className={ className }
			onPointerDown={ handlePointerDown }
			onPointerUp={ handlePointerUp }
			onPointerMove={ handlePointerMove }
		>
			{ children }
		</div>
	);
}
