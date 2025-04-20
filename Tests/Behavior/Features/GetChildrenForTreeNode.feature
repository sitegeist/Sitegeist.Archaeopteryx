Feature: GetChildrenForTreeNode

  Background:
    Given using the following content dimensions:
      | Identifier | Values      | Generalizations |
      | language   | de, en, gsw | gsw->de, en     |
    And using the following node types:
    """yaml
    'Neos.Neos:Document':
      abstract: true
      properties:
        title:
          type: string

    'Neos.Neos:Site':
      superTypes:
        'Neos.Neos:Document': true

    'Vendor.Site:Document':
      label: "${Neos.Node.labelForNode(node).prefix('My Node: ').properties('title')}"
      superTypes:
        'Neos.Neos:Document': true
      ui:
        icon: "my-icon"
        label: "My Document Type"
    """
    And using identifier "default", I define a content repository
    And I am in content repository "default"
    And the command CreateRootWorkspace is executed with payload:
      | Key                | Value           |
      | workspaceName      | "live"          |
      | newContentStreamId | "cs-identifier" |
    And I am in workspace "live" and dimension space point {"language": "de"}
    And the command CreateRootNodeAggregateWithNode is executed with payload:
      | Key             | Value                         |
      | nodeAggregateId | "root"                        |
      | nodeTypeName    | "Neos.ContentRepository:Root" |

    And the following CreateNodeAggregateWithNode commands are executed:
      | nodeAggregateId | parentNodeAggregateId | nodeTypeName         | initialPropertyValues | originDimensionSpacePoint |
      | homepage        | root                  | Neos.Neos:Site       | {"title": "home"}     | {"language": "en"}        |
      | features        | homepage              | Vendor.Site:Document | {"title": "features"} | {"language": "en"}        |
      | feature-a       | features              | Vendor.Site:Document | {"title": "a"}        | {"language": "en"}        |

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
      | Key             | Value             |
      | nodeAggregateId | "feature-a"       |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value                      |
      | nodeAggregateId           | "features"                 |
      | originDimensionSpacePoint | {"language": "de"}         |
      | propertyValues            | {"title": "features (de)"} |

    And the command SetNodeProperties is executed with payload:
      | Key                       | Value               |
      | nodeAggregateId           | "feature-a"         |
      | originDimensionSpacePoint | {"language": "de"}  |
      | propertyValues            | {"title": "a (de)"} |

  Scenario: GetChildrenForTreeNode for homepage with nested children
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | treeNodeId          | "homepage"           |
      | nodeTypeFilter      | ""                   |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
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
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for document with one child
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["de"]} |
      | treeNodeId          | "features"           |
      | nodeTypeFilter      | ""                   |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
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
                       "label": "My Node: a (de)",
                       "nodeAggregateIdentifier": "feature-a",
                       "nodeTypeLabel": "My Document Type"
                   }
               ]
          }
      }
      """

  Scenario: GetChildrenForTreeNode for leaf node
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-children-for-tree-node":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | treeNodeId          | "feature-a"          |
      | nodeTypeFilter      | ""                   |
      | linkableNodeTypes   | []                   |
    Then I expect the following query response:
      """json
      {
          "success": {
              "children": []
          }
      }
      """
