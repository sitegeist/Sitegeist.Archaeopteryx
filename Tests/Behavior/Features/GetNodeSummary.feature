Feature:

  Background:
    Given using the following content dimensions:
      | Identifier | Values      | Generalizations |
      | language   | de, en, gsw | gsw->de, en     |
    And using the following node types:
    """yaml
    'Neos.Neos:Document':
      properties:
        title:
          type: string
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
      | nodeAggregateId | parentNodeAggregateId | nodeTypeName       | initialPropertyValues | originDimensionSpacePoint |
      | document        | root                  | Neos.Neos:Document | {"title": "test"}     | {"language": "en"}        |

    And the command CreateNodeVariant is executed with payload:
      | Key             | Value             |
      | nodeAggregateId | "document"        |
      | sourceOrigin    | {"language":"en"} |
      | targetOrigin    | {"language":"de"} |

  Scenario: GetNodeSummary
    When I issue the following query to "http://127.0.0.1:8081/sitegeist/archaeopteryx/get-node-summary":
      | Key                 | Value                |
      | contentRepositoryId | "default"            |
      | workspaceName       | "live"               |
      | dimensionValues     | {"language": ["de"]} |
      | nodeId              | "document"           |
    Then I expect the following query response:
      """json
      {
          "success": {
              "breadcrumbs": [],
              "icon": "questionmark",
              "label": "Neos.Neos:Document",
              "uri": "node://document"
          }
      }
      """
