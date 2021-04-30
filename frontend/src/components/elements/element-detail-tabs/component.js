import React from 'react';
import ReactDOM from 'react-dom';
import { componentTagsStateSlice } from "./slice"
import { Provider } from "react-redux";
import store from "../../../store";
import {TagDropdown} from "../../shared/tag-dropdown";


const { setTags } = componentTagsStateSlice.actions;

function renderElementTags(elementID, existingTags) {
    store.dispatch(setTags(existingTags));

    $(window).on('load', function () {
        $("#content").show();
    });

    ReactDOM.render(
        <Provider store={store}>
            <TagDropdown
                action={setTags}
                updateTagsURL={`/api/v2/elements/${elementID}/tags/`}
                existingTags={existingTags} />
        </Provider>,
        document.getElementById('show-tags')
    );

}
// This is a hack to get it to work with existing django templates.
window.renderElementTags = renderElementTags;
