export {};

let { TypeFactory, Types } = require('js-amino');

let CyberDMsgLink = TypeFactory.create('CyberDMsgLink', [
  {
    name: 'address',
    type: Types.ByteSlice,
  },
  {
    name: 'links',
    type: Types.Struct,
  },
]);

let CyberDMsgLinkData = TypeFactory.create('CyberDMsgLinkData', [
  {
    name: 'from',
    type: Types.ByteSlice,
  },
  {
    name: 'to',
    type: Types.ByteSlice,
  },
]);

let CyberDTxRequest = TypeFactory.create('CyberDTxRequest', [
  {
    name: 'msgs',
    type: Types.ArrayStruct,
  },
  {
    name: 'fee',
    type: Types.Struct,
  },
  {
    name: 'signatures',
    type: Types.ArrayStruct,
  },
  {
    name: 'memo',
    type: Types.String,
  },
]);

let CyberDFee = TypeFactory.create('CyberDFee', [
  {
    name: 'amount',
    type: Types.ArrayStruct,
  },
  {
    name: 'gas',
    type: Types.Int32,
  },
]);

let CyberDSignature = TypeFactory.create('CyberDSignature', [
  {
    name: 'pub_key',
    type: Types.ByteSlice,
  },
  {
    name: 'signature',
    type: Types.ByteSlice,
  },
  {
    name: 'account_number',
    type: Types.Int32,
  },
  {
    name: 'sequence',
    type: Types.Int32,
  },
]);

module.exports = {
  CyberDMsgLink,
  CyberDMsgLinkData,
  CyberDTxRequest,
  CyberDFee,
  CyberDSignature,
};