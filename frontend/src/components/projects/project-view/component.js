import React from 'react';
import ReactDOM from 'react-dom';
import { projectTagsStateSlice } from "./slice"
import { Provider } from "react-redux";
import store from "../../../store";
import {TagDropdown} from "../../shared/tag-dropdown";


const { setTags } = projectTagsStateSlice.actions;

function renderProjectTags(projectID, existingTags) {
    store.dispatch(setTags(existingTags));

    $(window).on('load', function () {
        $("#content").show();
    });

    ReactDOM.render(
        <Provider store={store}>
            <TagDropdown
                action={setTags}
                updateTagsURL={`/api/v2/projects/${projectID}/tags/`}
                existingTags={existingTags} />
        </Provider>,
        document.getElementById('show-tags')
    );

}
// This is a hack to get it to work with existing django templates.
window.renderProjectTags = renderProjectTags;
