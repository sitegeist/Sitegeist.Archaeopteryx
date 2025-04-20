Feature: GetTreeQuery

  Background:
    Given using the following content dimensions:
      | Identifier | Values      | Generalizations |
      | language   | de, en, gsw | gsw->de, en     |
    And using the following node types:
    """yaml
    'Neos.Neos:Sites':
      superTypes:
        'Neos.ContentRepository:Root': true

    'Neos.Neos:Content':
      abstract: true

    'Neos.Neos:Document':
      abstract: true
      properties:
        title:
          type: string

    'Neos.Neos:Site':
      label: "${'Homepage ' + node.name}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "globe"
        label: "Home Page Type"

    'Vendor.Site:Document':
      label: "${Neos.Node.labelForNode(node).prefix('My Node: ').properties('title')}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-icon"
        label: "My Document Type"

    'Vendor.Site:OtherDocument':
      label: "My Other Node"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-other-icon"
        label: "My Other Document Type"

    'Vendor.Site:Content':
      superTypes:
        'Neos.Neos:Content': true
      ui:
        icon: "my-content"
        label: "My Content"

    'Vendor.Site:SpecialLinkable':
      abstract: true

    'Vendor.Site:IncludedLinkableDocument':
      superTypes:
        'Vendor.Site:Document': true
        'Vendor.Site:SpecialLinkable': true
      ui:
        label: "My Included Document Type"

    'Vendor.Site:ExcludedLinkableDocument':
      superTypes:
        'Vendor.Site:IncludedLinkableDocument': true
        'Vendor.Site:SpecialLinkable': false
      ui:
        label: "My Excluded Document Type"
    """
    And using identifier "default", I define a content repository
    And I am in content repository "default"
    And the command CreateRootWorkspace is executed with payload:
      | Key                | Value           |
      | workspaceName      | "live"          |
      | newContentStreamId | "cs-identifier" |
    And I am in workspace "live" and dimension space point {"language": "en"}
    And the command CreateRootNodeAggregateWithNode is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "sites"           |
      | nodeTypeName    | "Neos.Neos:Sites" |

    And the following CreateNodeAggregateWithNode commands are executed:
      | nodeAggregateId      | parentNodeAggregateId | nodeTypeName                         | initialPropertyValues | originDimensionSpacePoint | nodeName |
      | homepage             | sites                 | Neos.Neos:Site                       | {"title": "home"}     | {"language": "en"}        | site-a   |
      | features             | homepage              | Vendor.Site:Document                 | {"title": "features"} | {"language": "en"}        | features |
      | content-a            | features              | Vendor.Site:Content                  | {}                    | {"language": "en"}        |          |
      | feature-a-multi-dsp  | features              | Vendor.Site:Document                 | {"title": "a"}        | {"language": "en"}        | a        |
      | feature-b-disabled   | features              | Vendor.Site:Document                 | {"title": "b"}        | {"language": "en"}        |          |
      | feature-c-other-type | features              | Vendor.Site:OtherDocument            | {"title": "c"}        | {"language": "en"}        |          |
      | linkable             | homepage              | Vendor.Site:Document                 | {"title": "linkable"} | {"language": "en"}        | linkable |
      | linkable-a-default   | linkable              | Vendor.Site:Document                 | {"title": "a"}        | {"language": "en"}        |          |
      | linkable-b-included  | linkable              | Vendor.Site:IncludedLinkableDocument | {"title": "b"}        | {"language": "en"}        |          |
      | linkable-c-excluded  | linkable              | Vendor.Site:ExcludedLinkableDocument | {"title": "c"}        | {"language": "en"}        |          |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "homepage"        |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "features"        |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value                 |
      | nodeAggregateId | "feature-a-multi-dsp" |
      | sourceOrigin    | {"language":"en"}     |
      | targetOrigin    | {"language":"de"}     |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                      |
      | nodeAggregateId           | "features"                 |
      | originDimensionSpacePoint | {"language": "de"}         |
      | propertyValues            | {"title": "features (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                 |
      | nodeAggregateId           | "feature-a-multi-dsp" |
      | originDimensionSpacePoint | {"language": "de"}    |
      | propertyValues            | {"title": "a (de)"}   |

    Given the command TagSubtree is executed with payload:
      | Key                          | Value                |
      | nodeAggregateId              | "feature-b-disabled" |
      | nodeVariantSelectionStrategy | "allVariants"        |
      | tag                          | "disabled"           |

  Scenario: Simplest GetTreeQuery for homepage ignored children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                       |
      | contentRepositoryId  | "default"                   |
      | workspaceName        | "live"                      |
      | dimensionValues      | {"language": ["en"]}        |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a" |
      | loadingDepth         | 0                           |
      | baseNodeTypeFilter   | ""                          |
      | linkableNodeTypes    | []                          |
      | narrowNodeTypeFilter | ""                          |
      | searchTerm           | ""                          |
      | selectedNodeId       | null                        |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "children": [],
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": true,
                  "icon": "globe",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isLinkable": true,
                  "isMatchedByFilter": true,
                  "label": "Homepage site-a",
                  "nodeAggregateIdentifier": "homepage",
                  "nodeTypeLabel": "Home Page Type"
              }
          }
      }
      """

  Scenario: GetTreeQuery for homepage with one level of children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                       |
      | contentRepositoryId  | "default"                   |
      | workspaceName        | "live"                      |
      | dimensionValues      | {"language": ["en"]}        |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a" |
      | loadingDepth         | 1                           |
      | baseNodeTypeFilter   | ""                          |
      | linkableNodeTypes    | []                          |
      | narrowNodeTypeFilter | ""                          |
      | searchTerm           | ""                          |
      | selectedNodeId       | null                        |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "children": [
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": true,
                           "icon": "my-icon",
                           "isDisabled": false,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Node: features",
                           "nodeAggregateIdentifier": "features",
                           "nodeTypeLabel": "My Document Type"
                       },
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": true,
                           "icon": "my-icon",
                           "isDisabled": false,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Node: linkable",
                           "nodeAggregateIdentifier": "linkable",
                           "nodeTypeLabel": "My Document Type"
                       }
                  ],
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "globe",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isLinkable": true,
                  "isMatchedByFilter": true,
                  "label": "Homepage site-a",
                  "nodeAggregateIdentifier": "homepage",
                  "nodeTypeLabel": "Home Page Type"
              }
          }
      }
      """

  Scenario: GetTreeQuery for leaf node
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                                  |
      | contentRepositoryId  | "default"                              |
      | workspaceName        | "live"                                 |
      | dimensionValues      | {"language": ["en"]}                   |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a/features/a" |
      | loadingDepth         | 8                                      |
      | baseNodeTypeFilter   | ""                                     |
      | linkableNodeTypes    | []                                     |
      | narrowNodeTypeFilter | ""                                     |
      | searchTerm           | ""                                     |
      | selectedNodeId       | null                                   |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "children": [],
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "my-icon",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isLinkable": true,
                  "isMatchedByFilter": true,
                  "label": "My Node: a",
                  "nodeAggregateIdentifier": "feature-a-multi-dsp",
                  "nodeTypeLabel": "My Document Type"
              }
          }
      }
      """

  Scenario: GetTreeQuery for document with multiple children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                                |
      | contentRepositoryId  | "default"                            |
      | workspaceName        | "live"                               |
      | dimensionValues      | {"language": ["en"]}                 |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a/features" |
      | loadingDepth         | 4                                    |
      | baseNodeTypeFilter   | "Neos.Neos:Document"                 |
      | linkableNodeTypes    | []                                   |
      | narrowNodeTypeFilter | ""                                   |
      | searchTerm           | ""                                   |
      | selectedNodeId       | null                                 |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "children": [
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": false,
                           "icon": "my-icon",
                           "isDisabled": false,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Node: a",
                           "nodeAggregateIdentifier": "feature-a-multi-dsp",
                           "nodeTypeLabel": "My Document Type"
                       },
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": false,
                           "icon": "my-icon",
                           "isDisabled": true,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Node: b",
                           "nodeAggregateIdentifier": "feature-b-disabled",
                           "nodeTypeLabel": "My Document Type"
                       },
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": false,
                           "icon": "my-other-icon",
                           "isDisabled": false,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Other Node",
                           "nodeAggregateIdentifier": "feature-c-other-type",
                           "nodeTypeLabel": "My Other Document Type"
                       }
                   ],
                   "hasScheduledDisabledState": false,
                   "hasUnloadedChildren": false,
                   "icon": "my-icon",
                   "isDisabled": false,
                   "isHiddenInMenu": false,
                   "isLinkable": true,
                   "isMatchedByFilter": true,
                   "label": "My Node: features",
                   "nodeAggregateIdentifier": "features",
                   "nodeTypeLabel": "My Document Type"
              }
          }
      }
      """

  Scenario: GetTreeQuery for document with filtered children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                                |
      | contentRepositoryId  | "default"                            |
      | workspaceName        | "live"                               |
      | dimensionValues      | {"language": ["en"]}                 |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a/features" |
      | loadingDepth         | 4                                    |
      | baseNodeTypeFilter   | "Vendor.Site:OtherDocument"          |
      | linkableNodeTypes    | []                                   |
      | narrowNodeTypeFilter | ""                                   |
      | searchTerm           | ""                                   |
      | selectedNodeId       | null                                 |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "children": [
                       {
                           "children": [],
                           "hasScheduledDisabledState": false,
                           "hasUnloadedChildren": false,
                           "icon": "my-other-icon",
                           "isDisabled": false,
                           "isHiddenInMenu": false,
                           "isLinkable": true,
                           "isMatchedByFilter": true,
                           "label": "My Other Node",
                           "nodeAggregateIdentifier": "feature-c-other-type",
                           "nodeTypeLabel": "My Other Document Type"
                       }
                  ],
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "icon": "my-icon",
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "isLinkable": true,
                  "isMatchedByFilter": false,
                  "label": "My Node: features",
                  "nodeAggregateIdentifier": "features",
                  "nodeTypeLabel": "My Document Type"
              }
          }
      }
      """

  Scenario: GetTreeQuery for homepage with all children in other dimension
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                       |
      | contentRepositoryId  | "default"                   |
      | workspaceName        | "live"                      |
      | dimensionValues      | {"language": ["de"]}        |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a" |
      | loadingDepth         | 8                           |
      | baseNodeTypeFilter   | "Neos.Neos:Document"        |
      | linkableNodeTypes    | []                          |
      | narrowNodeTypeFilter | ""                          |
      | searchTerm           | ""                          |
      | selectedNodeId       | null                        |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "nodeAggregateIdentifier": "homepage",
                  "icon": "globe",
                  "label": "Homepage site-a",
                  "nodeTypeLabel": "Home Page Type",
                  "isMatchedByFilter": true,
                  "isLinkable": true,
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "children": [
                      {
                          "nodeAggregateIdentifier": "features",
                          "icon": "my-icon",
                          "label": "My Node: features (de)",
                          "nodeTypeLabel": "My Document Type",
                          "isMatchedByFilter": true,
                          "isLinkable": true,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "children": [
                              {
                                  "nodeAggregateIdentifier": "feature-a-multi-dsp",
                                  "icon": "my-icon",
                                  "label": "My Node: a (de)",
                                  "nodeTypeLabel": "My Document Type",
                                  "isMatchedByFilter": true,
                                  "isLinkable": true,
                                  "isDisabled": false,
                                  "isHiddenInMenu": false,
                                  "hasScheduledDisabledState": false,
                                  "hasUnloadedChildren": false,
                                  "children": []
                              }
                          ]
                      }
                  ]
              }
          }
      }
      """

  Scenario: GetTreeQuery for document with filtered children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-tree":
      | Key                  | Value                                |
      | contentRepositoryId  | "default"                            |
      | workspaceName        | "live"                               |
      | dimensionValues      | {"language": ["en"]}                 |
      | startingPoint        | "/<Neos.Neos:Sites>/site-a/linkable" |
      | loadingDepth         | 8                                    |
      | baseNodeTypeFilter   | "Neos.Neos:Document"                 |
      | linkableNodeTypes    | ["Vendor.Site:SpecialLinkable"]      |
      | narrowNodeTypeFilter | ""                                   |
      | searchTerm           | ""                                   |
      | selectedNodeId       | null                                 |

    Then I expect the following query response:
      """json
      {
          "success": {
              "root": {
                  "nodeAggregateIdentifier": "linkable",
                  "icon": "my-icon",
                  "label": "My Node: linkable",
                  "nodeTypeLabel": "My Document Type",
                  "isMatchedByFilter": true,
                  "isLinkable": false,
                  "isDisabled": false,
                  "isHiddenInMenu": false,
                  "hasScheduledDisabledState": false,
                  "hasUnloadedChildren": false,
                  "children": [
                      {
                          "nodeAggregateIdentifier": "linkable-a-default",
                          "icon": "my-icon",
                          "label": "My Node: a",
                          "nodeTypeLabel": "My Document Type",
                          "isMatchedByFilter": true,
                          "isLinkable": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "children": []
                      },
                      {
                          "nodeAggregateIdentifier": "linkable-b-included",
                          "icon": "my-icon",
                          "label": "My Node: b",
                          "nodeTypeLabel": "My Included Document Type",
                          "isMatchedByFilter": true,
                          "isLinkable": true,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "children": []
                      },
                      {
                          "nodeAggregateIdentifier": "linkable-c-excluded",
                          "icon": "my-icon",
                          "label": "My Node: c",
                          "nodeTypeLabel": "My Excluded Document Type",
                          "isMatchedByFilter": true,
                          "isLinkable": false,
                          "isDisabled": false,
                          "isHiddenInMenu": false,
                          "hasScheduledDisabledState": false,
                          "hasUnloadedChildren": false,
                          "children": []
                      }
                  ]
              }
          }
      }
      """
