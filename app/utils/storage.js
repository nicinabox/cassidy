var medium = localStorage;

var serialize = (data) => {
  return JSON.stringify(data);
};

var deserialize = (data) => {
  try {
    return JSON.parse(data);
  } catch(e) {
    return data || undefined;
  }
};

var setItem = (k, v) => {
  try {
    medium.setItem(k, serialize(v));
  } catch (e) {
    console.error(e);
  }
};

var getItem = (k) => {
  return deserialize(medium.getItem(k));
};

var initialize = () => {
  storage.getManifest();
  storage.setCache();
};

var storage = {
  cache: {},
  manifest: [],
  manifestKey: 'cache.manifest',

  getManifest() {
    var manifest = this.get(this.manifestKey);
    if (manifest) {
      this.manifest = manifest;
    } else {
      this.saveManifest(this.manifest);
    }
  },

  saveManifest(newManfist) {
    this.manifest = newManfist;
    this.cacheManifestItems();
    setItem(this.manifestKey, this.manifest);
  },

  addToManifest(key) {
    if (this.manifest.indexOf(key) < 0) {
      this.manifest.push(key);
    }

    this.saveManifest(this.manifest);
  },

  removeFromManifest(key) {
    var index = this.manifest.indexOf(key);
    this.manifest.splice(index, 1);
    delete this.cache[key];
    this.saveManifest(this.manifest);
  },

  cacheManifestItems() {
    return this.manifest.map((k) => {
      var data = this.get(k);
      if (data) {
        this.cache[k] = data;
      } else {
        return k;
      }
    });
  },

  setCache() {
    var toRemove = this.cacheManifestItems();

    if (toRemove.length) {
      toRemove.forEach((key) => {
        if (key) {
          var index = this.manifest.indexOf(key);
          this.manifest.splice(index, 1);
        }
      });
      this.saveManifest(this.manifest);
    }
  },

  set(key, value) {
    setItem(key, value);
    this.addToManifest(key);
  },

  get(key) {
    var val = getItem(key);
    try {
      val = JSON.parse(val);
    } catch (e) {}
    return val;
  },

  remove(key) {
    this.removeFromManifest(key);
    medium.removeItem(key);
  },

  invalidate(key) {
    this.removeFromManifest(key);
  },

  clear() {
    this.manifest.forEach((key) => {
      this.remove(key);
    });
  }
};

initialize();

module.exports = window.storage = storage;
