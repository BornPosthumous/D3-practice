import {
  range
} from 'lodash';
import {
  Node,
  BST
} from './bst.js'

export function getOffset( el ) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}
// Generate a list of random integers;
export const getRandomInt = ( min, max ) => {
  min = Math.ceil( min );
  max = Math.floor( max );
  return Math.floor( Math.random() * ( max - min ) ) + min;
};
const random_list = num_items => new Set( range( num_items )
  .map( n => getRandomInt( 1, num_items ) ) );

const setBst = bst => v => bst.insert( bst.root, new Node( v ) );

export const getBST = num_items => {
  let unsorted_list = random_list( num_items );
  let rootValue = unsorted_list.values()
    .next()
    .value;

  unsorted_list.delete( rootValue );
  let bst = new BST( new Node( rootValue ) );

  for ( var it = unsorted_list.values(), val = null; val = it.next()
    .value; ) {
    setBst( bst )( val );
  }
  return bst
}