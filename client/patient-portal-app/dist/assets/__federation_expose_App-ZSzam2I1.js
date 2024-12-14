import { importShared } from './__federation_fn_import-DHhB77oP.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

const React = await importShared('react');
const {useState} = React;

const {useMutation,gql: gql$1} = await importShared('@apollo/client');

const ADD_EMERGENCY_ALERT = gql$1`
  mutation AddEmergencyAlert($patientName: String!, $type: String!, $description: String) {
    addEmergencyAlert(patientName: $patientName, type: $type, description: $description) {
      id
      patientName
      type
      description
      timestamp
    }
  }
`;
function EmergencyAlertForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    type: "",
    description: ""
  });
  const [addEmergencyAlert] = useMutation(ADD_EMERGENCY_ALERT);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addEmergencyAlert({ variables: formData });
      if (data && data.addEmergencyAlert) {
        alert("Emergency alert sent successfully!");
        setFormData({ patientName: "", type: "", description: "" });
      } else {
        console.error("Error sending alert: Unexpected response from server");
        alert("Failed to send alert. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      alert("Failed to send alert. Please check your connection and try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: " Patient Name " }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          name: "patientName",
          value: formData.patientName,
          onChange: handleChange,
          required: true
        }
      )
    ] }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: " Type of Emergency " }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          name: "type",
          value: formData.type,
          onChange: handleChange,
          required: true
        }
      )
    ] }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: " Description " }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          name: "description",
          value: formData.description,
          onChange: handleChange
        }
      ),
      " "
    ] }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", children: " Send Alert " }),
    " "
  ] });
}

await importShared('react');

const {useQuery,gql} = await importShared('@apollo/client');

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    emergencyAlerts {
      id
      patientName
      type
      description
      timestamp
    }
  }
`;
function AlertsList() {
  const { loading, error, data } = useQuery(GET_EMERGENCY_ALERTS);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading..." });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    "Error: ",
    error.message
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Emergency Alerts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: data.emergencyAlerts.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Patient:" }),
        " ",
        alert.patientName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Type:" }),
        " ",
        alert.type
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Description:" }),
        " ",
        alert.description
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Timestamp:" }),
        " ",
        new Date(alert.timestamp).toLocaleString()
      ] })
    ] }, alert.id)) })
  ] });
}

await importShared('react');

const {ApolloClient,InMemoryCache,ApolloProvider} = await importShared('@apollo/client');
const client = new ApolloClient({
  uri: undefined                                     ,
  cache: new InMemoryCache(),
  credentials: "include"
});
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ApolloProvider, { client, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "App", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Patient Emergency Alerts" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmergencyAlertForm, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertsList, {})
  ] }) });
}

export { App as default, jsxRuntimeExports as j };
