Feature: GetNodeSummary

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

  Scenario: GetNodeSummary for not configured entry node
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "homepage"           |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [],
              "icon": "questionmark",
              "label": "Neos.Neos:Site",
              "uri": "node://homepage"
          }
      }
      """

  Scenario: GetNodeSummary for customized node with parent
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["en"]} |
      | nodeId              | "features"           |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "my-icon",
                      "label": "My Node: features"
                  }
              ],
              "icon": "my-icon",
              "label": "My Node: features",
              "uri": "node://features"
          }
      }
      """

  Scenario: GetNodeSummary for customized node with multiple parents in another language
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["de"]} |
      | nodeId              | "feature-a"          |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [
                  {
                      "icon": "my-icon",
                      "label": "My Node: features (de)"
                  },
                  {
                      "icon": "my-icon",
                      "label": "My Node: a (de)"
                  }
              ],
              "icon": "my-icon",
              "label": "My Node: a (de)",
              "uri": "node://feature-a"
          }
      }
      """
