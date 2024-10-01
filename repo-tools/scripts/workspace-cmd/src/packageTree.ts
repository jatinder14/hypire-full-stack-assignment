import { PackageType } from './models';

type PackageTypeWithDependencies = PackageType & {
  dependencies: string[];
  devDependencies: string[];
};

export function sortWithPackageTree(pkgs: PackageType[], buildFrom, buildTo: string): PackageType[] {
  if (buildFrom && buildTo) {
    throw new Error('Cannot specify both --from and --to');
  }

  const pkgNames = pkgs.map((pkg) => pkg.name);

  let pkgsWithDependencies = pkgs.map((pkg) => {
    const pkgJson = require(`${__dirname}/../../../../${pkg.location}/package.json`);
    return {
      ...pkg,
      dependencies: Object.keys(pkgJson.dependencies || {}).filter((d) => pkgNames.includes(d)),
      devDependencies: Object.keys(pkgJson.devDependencies || {}).filter((d) => pkgNames.includes(d))
    };
  });

  if (buildFrom) {
    pkgsWithDependencies = [
      ...new Set([
        ...filterBuildFrom(pkgsWithDependencies, buildFrom),
        ...filterBuildTo(pkgsWithDependencies, buildFrom)
      ])
    ];
  }

  if (buildTo) {
    pkgsWithDependencies = filterBuildTo(pkgsWithDependencies, buildTo);
  }

  pkgsWithDependencies.sort((a, b) => {
    if (b.dependencies.includes(a.name) || b.devDependencies.includes(a.name)) {
      return -1;
    }
    if (a.dependencies.includes(b.name) || a.devDependencies.includes(b.name)) {
      return 1;
    }
    if (a.dependencies.length + a.devDependencies.length > b.dependencies.length + b.devDependencies.length) {
      return 1;
    }
    if (a.dependencies.length + a.devDependencies.length < b.dependencies.length + b.devDependencies.length) {
      return -1;
    }
    return 0;
  });

  return pkgsWithDependencies;
}

function filterBuildTo(pkgs: PackageTypeWithDependencies[], buildTo: string): PackageTypeWithDependencies[] {
  const result: PackageTypeWithDependencies[] = [];

  const pkg = pkgs.find((pkg) => pkg.name === buildTo);
  if (!pkg) {
    throw new Error(`Package ${buildTo} not found`);
  }

  result.push(pkg);

  for (const dep of pkg.dependencies) {
    const resultFromDep = filterBuildTo(pkgs, dep);
    result.push(...resultFromDep);
  }

  for (const dep of pkg.devDependencies) {
    const resultFromDep = filterBuildTo(pkgs, dep);
    result.push(...resultFromDep);
  }

  return [...new Set(result)];
}

function filterBuildFrom(
  pkgs: PackageTypeWithDependencies[],
  buildFrom: string
): PackageTypeWithDependencies[] {
  const result: PackageTypeWithDependencies[] = [];
  const pkg = pkgs.find((pkg) => pkg.name === buildFrom);

  if (!pkg) {
    throw new Error(`Package ${buildFrom} not found`);
  }

  result.push(pkg);

  for (const pkg of pkgs) {
    if (pkg.dependencies.includes(buildFrom) || pkg.devDependencies.includes(buildFrom)) {
      result.push(pkg, ...filterBuildFrom(pkgs, pkg.name));
    }
  }

  return [...new Set(result)];
}
