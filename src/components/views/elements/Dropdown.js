/*
Copyright 2017 Vector Creations Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import classnames from 'classnames';
import AccessibleButton from './AccessibleButton';

class MenuOption extends React.Component {
    constructor(props) {
        super(props)
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _onMouseEnter() {
        this.props.setHighlighted(this.props.dropdownKey);
    }

    _onClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClick(this.props.dropdownKey);
    }

    render() {
        const optClasses = classnames({
            mx_Dropdown_option: true,
            mx_Dropdown_option_highlight: this.props.highlighted,
        });

        return <div className={optClasses}
            onClick={this._onClick} onKeyPress={this._onKeyPress}
            onMouseEnter={this._onMouseEnter}
        >
            {this.props.children}
        </div>
    }
};

MenuOption.propTypes = {
    dropdownKey: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired,
    setHighlighted: React.PropTypes.func.isRequired,
};

/*
 * Reusable dropdown select control, akin to react-select,
 * but somewhat simpler as react-select is 79KB of minified
 * javascript.
 *
 * TODO: Port NetworkDropdown to use this.
 */
export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.dropdownRootElement = null;
        this.ignoreEvent = null;

        this._onInputClick = this._onInputClick.bind(this);
        this._onRootClick = this._onRootClick.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onMenuOptionClick = this._onMenuOptionClick.bind(this);
        this._onInputKeyPress = this._onInputKeyPress.bind(this);
        this._onInputKeyUp = this._onInputKeyUp.bind(this);
        this._onInputChange = this._onInputChange.bind(this);
        this._collectRoot = this._collectRoot.bind(this);
        this._collectInputTextBox = this._collectInputTextBox.bind(this);
        this._setHighlightedOption = this._setHighlightedOption.bind(this);

        this.inputTextBox = null;

        this._reindexChildren(this.props.children);

        this.state = {
            // True if the menu is dropped-down
            expanded: false,
            // The key of the selected option
            selectedOption: props.children[0].key,
            // The key of the highlighted option
            // (the option that would become selected if you pressed enter)
            highlightedOption: props.children[0].key,
            // the current search query
            searchQuery: '',
        };
    }

    componentWillMount() {
        // Listen for all clicks on the document so we can close the
        // menu when the user clicks somewhere else
        document.addEventListener('click', this._onDocumentClick, false);

        // fire this now so the defaults can be set up
        this.props.onOptionChange(this.state.selectedOption);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._onDocumentClick, false);
    }

    componentWillReceiveProps(nextProps) {
        this._reindexChildren(nextProps.children);
        this.setState({
            highlightedOption: Object.keys(this.childrenByKey)[0],
        });
    }

    _reindexChildren(children) {
        this.childrenByKey = {};
        for (const child of children) {
            this.childrenByKey[child.key] = child;
        }
    }

    _onDocumentClick(ev) {
        // Close the dropdown if the user clicks anywhere that isn't
        // within our root element
        if (ev !== this.ignoreEvent) {
            this.setState({
                expanded: false,
            });
        }
    }

    _onRootClick(ev) {
        // This captures any clicks that happen within our elements,
        // such that we can then ignore them when they're seen by the
        // click listener on the document handler, ie. not close the
        // dropdown immediately after opening it.
        // NB. We can't just stopPropagation() because then the event
        // doesn't reach the React onClick().
        this.ignoreEvent = ev;
    }

    _onInputClick(ev) {
        this.setState({
            expanded: !this.state.expanded,
        });
        ev.preventDefault();
    }

    _onMenuOptionClick(dropdownKey) {
        this.setState({
            expanded: false,
            selectedOption: dropdownKey,
        });
        this.props.onOptionChange(dropdownKey);
    }

    _onInputKeyPress(e) {
        // This needs to be on the keypress event because otherwise
        // it can't cancel the form submission
        if (e.key == 'Enter') {
            this.setState({
                expanded: false,
                selectedOption: this.state.highlightedOption,
            });
            this.props.onOptionChange(this.state.highlightedOption);
            e.preventDefault();
        }
    }

    _onInputKeyUp(e) {
        // These keys don't generate keypress events and so needs to
        // be on keyup
        if (e.key == 'Escape') {
            this.setState({
                expanded: false,
            });
        } else if (e.key == 'ArrowDown') {
            this.setState({
                highlightedOption: this._nextOption(this.state.highlightedOption),
            });
        } else if (e.key == 'ArrowUp') {
            this.setState({
                highlightedOption: this._prevOption(this.state.highlightedOption),
            });
        }
    }

    _onInputChange(e) {
        this.setState({
            searchQuery: e.target.value,
        });
        if (this.props.onSearchChange) {
            this.props.onSearchChange(e.target.value);
        }
    }

    _collectRoot(e) {
        if (this.dropdownRootElement) {
            this.dropdownRootElement.removeEventListener(
                'click', this._onRootClick, false,
            );
        }
        if (e) {
            e.addEventListener('click', this._onRootClick, false);
        }
        this.dropdownRootElement = e;
    }

    _collectInputTextBox(e) {
        this.inputTextBox = e;
        if (e) e.focus();
    }

    _setHighlightedOption(optionKey) {
        this.setState({
            highlightedOption: optionKey,
        });
    }

    _nextOption(optionKey) {
        const keys = Object.keys(this.childrenByKey);
        const index = keys.indexOf(optionKey);
        return keys[(index + 1) % keys.length];
    }

    _prevOption(optionKey) {
        const keys = Object.keys(this.childrenByKey);
        const index = keys.indexOf(optionKey);
        return keys[(index - 1) % keys.length];
    }

    _getMenuOptions() {
        const options = this.props.children.map((child) => {
            return (
                <MenuOption key={child.key} dropdownKey={child.key}
                    highlighted={this.state.highlightedOption == child.key}
                    setHighlighted={this._setHighlightedOption}
                    onClick={this._onMenuOptionClick}
                >
                    {child}
                </MenuOption>
            );
        });

        if (!this.state.searchQuery) {
            options.push(
                <div key="_searchprompt" className="mx_Dropdown_searchPrompt">
                    Type to search...
                </div>
            );
        }
        return options;
    }

    render() {
        let currentValue;

        const menuStyle = {};
        if (this.props.menuWidth) menuStyle.width = this.props.menuWidth;

        let menu;
        if (this.state.expanded) {
            currentValue = <input type="text" className="mx_Dropdown_option"
                ref={this._collectInputTextBox} onKeyPress={this._onInputKeyPress}
                onKeyUp={this._onInputKeyUp}
                onChange={this._onInputChange}
                value={this.state.searchQuery}
            />;
            menu = <div className="mx_Dropdown_menu" style={menuStyle}>
                {this._getMenuOptions()}
            </div>;
        } else {
            const selectedChild = this.props.getShortOption ?
                this.props.getShortOption(this.state.selectedOption) :
                this.childrenByKey[this.state.selectedOption];
            currentValue = <div className="mx_Dropdown_option">
                {selectedChild}
            </div>
        }

        const menuOptions = this._getMenuOptions();

        const dropdownClasses = {
            mx_Dropdown: true,
        };
        if (this.props.className) {
            dropdownClasses[this.props.className] = true;
        }

        return <div className={classnames(dropdownClasses)} ref={this._collectRoot}>
            <AccessibleButton className="mx_Dropdown_input" onClick={this._onInputClick}>
                {currentValue}
                <span className="mx_Dropdown_arrow"></span>
                {menu}
            </AccessibleButton>
        </div>;
    }
}

Dropdown.propTypes = {
    // The width that the dropdown should be. If specified,
    // the dropped-down part of the menu will be set to this
    // width.
    menuWidth: React.PropTypes.number,
    // Called when the selected option changes
    onOptionChange: React.PropTypes.func.isRequired,
    // Called when the value of the search field changes
    onSearchChange: React.PropTypes.func,
    // Function that, given the key of an option, returns
    // a node representing that option to be displayed in the
    // box itself as the currently-selected option (ie. as
    // opposed to in the actual dropped-down part). If
    // unspecified, the appropriate child element is used as
    // in the dropped-down menu.
    getShortOption: React.PropTypes.func,
}