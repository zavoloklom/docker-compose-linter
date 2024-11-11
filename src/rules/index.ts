import NoBuildAndImageRule from './no-build-and-image-rule';
import NoDuplicateContainerNamesRule from './no-duplicate-container-names-rule';
import NoDuplicateExportedPortsRule from './no-duplicate-exported-ports-rule';
import NoQuotesInVolumesRule from './no-quotes-in-volumes-rule';
import NoUnboundPortInterfacesRule from './no-unbound-port-interfaces-rule';
import NoVersionFieldRule from './no-version-field-rule';
import RequireProjectNameFieldRule from './require-project-name-field-rule';
import RequireQuotesInPortsRule from './require-quotes-in-ports-rule';
import ServiceContainerNameRegexRule from './service-container-name-regex-rule';
import ServiceDependenciesAlphabeticalOrderRule from './service-dependencies-alphabetical-order-rule';
import ServiceImageRequireExplicitTagRule from './service-image-require-explicit-tag-rule';
import ServiceKeysOrderRule from './service-keys-order-rule';
import ServicePortsAlphabeticalOrderRule from './service-ports-alphabetical-order-rule';
import ServicesAlphabeticalOrderRule from './services-alphabetical-order-rule';
import TopLevelPropertiesOrderRule from './top-level-properties-order-rule';

export default {
  NoBuildAndImageRule,
  NoDuplicateContainerNamesRule,
  NoDuplicateExportedPortsRule,
  NoQuotesInVolumesRule,
  NoUnboundPortInterfacesRule,
  NoVersionFieldRule,
  RequireProjectNameFieldRule,
  RequireQuotesInPortsRule,
  ServiceContainerNameRegexRule,
  ServiceDependenciesAlphabeticalOrderRule,
  ServiceImageRequireExplicitTagRule,
  ServiceKeysOrderRule,
  ServicePortsAlphabeticalOrderRule,
  ServicesAlphabeticalOrderRule,
  TopLevelPropertiesOrderRule,
};
