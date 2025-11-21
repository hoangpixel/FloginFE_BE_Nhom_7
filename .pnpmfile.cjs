function readPackage(pkg) {
  if (pkg.name === 'cypress') {
    pkg.scripts = pkg.scripts || {};
    // This will allow the cypress postinstall script to run
    delete pkg.scripts.postinstall;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
