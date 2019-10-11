import React from "react";

function EmailWidget(props) {
  const { TextField } = props.registry.widgets;
  return <TextField type="email" {...props} />;
}

export default EmailWidget;