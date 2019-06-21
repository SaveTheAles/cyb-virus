const ipfsClient = require('ipfs-http-client');
const ipfsHelper = require('../services/ipfsHelper');
const pull = require('pull-stream');
let ipfs;

module.exports = {
  init(options) {
    ipfs = ipfsClient(options);
  },
  saveContent(content) {
    const bufferContent = Buffer.from(content, 'utf8');

    return ipfs.add([{ content: bufferContent }]).then(async result => {
      await ipfs.pin.add(result[0].hash);
      return result[0];
    });
  },
  async saveIpld(objectData) {
    const savedObj = await ipfs.dag.put(objectData);
    const ipldHash = ipfsHelper.cidToHash(savedObj);
    await ipfs.pin.add(ipldHash);
    return ipldHash;
  },
  async getObject(storageId) {
    if (ipfsHelper.isCid(storageId)) {
      storageId = ipfsHelper.cidToHash(storageId);
    }
    return ipfs.dag.get(storageId).then(response => response.value);
  },
  async getObjectProp(storageId, propName) {
    return ipfs.dag.get(storageId + '/' + propName).then(response => response.value);
  },

  async bindToStaticId(storageId, accountKey) {
    if (_.startsWith(accountKey, 'Qm')) {
      accountKey = await this.getAccountNameById(accountKey);
    }
    return this.node.name
      .publish(`${storageId}`, {
        key: accountKey,
        lifetime: '175200h',
      })
      .then(response => response.name);
  },

  async getFileStats(file) {
    //TODO: make it work
    // return ipfs.files.stat('/' + file);
    return new Promise((resolve, reject) => {
      pull(
        ipfs.lsPullStream(file),
        pull.collect((err, files) => {
          if (err) {
            throw err;
          }

          console.log('result', file, files);
          return resolve(files[0]);
        })
      );
    });
  },
  getPeersList() {
    return new Promise((resolve, reject) => {
      let responded = false;
      setTimeout(() => {
        if (responded) {
          return;
        }
        reject('Failed to fetch');
      }, 1000);
      ipfs.bootstrap.list((err, res) => {
        responded = true;
        return err ? reject(err) : resolve(res.Peers);
      });
    });
  },
};

// geesome.saveData(request.content, request.filename).then(ipfsHash => {
//   setAction({ type: 'page-action', method: 'link', data: { contentHash: ipfsHash, keywords: null } });
//
// (global as any).chrome.runtime.sendMessage({
//   type: 'loading-end',
// });
//   (global as any).chrome.runtime.sendMessage(
//     {
//       type: 'page-action',
//       method: 'link',
//       data: {
//         contentHash: ipfsHash,
//         keywords: null,
//       },
//     },
//     response => {
//       setAction(null);
//     }
//   );
// });