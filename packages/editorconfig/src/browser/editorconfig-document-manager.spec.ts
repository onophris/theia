/*
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { enableJSDOM } from '@theia/core/lib/browser/test/jsdom';

const disableJSDOM = enableJSDOM();

import { expect } from 'chai';
import { EditorconfigDocumentManager } from './editorconfig-document-manager';
import * as sinon from 'sinon';
import { KnownProps } from 'editorconfig';
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';

disableJSDOM();

describe('Editorconfig document manager', function () {

    it('IsSet should return true', () => {
        const documentManager = new EditorconfigDocumentManager();
        expect(documentManager.isSet('value')).to.be.true;
    });

    it('IsSet should return false', () => {
        const documentManager = new EditorconfigDocumentManager();
        expect(documentManager.isSet('unset')).to.be.false;
    });

    it('Should handle all properties except `tab_width`', () => {
        const documentManager = new EditorconfigDocumentManager();

        const stubIndentStyle = sinon.stub(documentManager, 'ensureIndentStyle');
        const stubIndentSize = sinon.stub(documentManager, 'ensureIndentSize');
        const stubEndOfLine = sinon.stub(documentManager, 'ensureEndOfLine');
        const stubTrimTrailingWhitespace = sinon.stub(documentManager, 'ensureTrimTrailingWhitespace');
        const stubEndsWithNewLine = sinon.stub(documentManager, 'ensureEndsWithNewLine');

        const properties = {
            indent_style: 'space',
            indent_size: 4,
            tab_width: 4,
            end_of_line: 'crlf',
            trim_trailing_whitespace: true,
            insert_final_newline: true
        } as KnownProps;

        documentManager.applyProperties(properties, {} as MonacoEditor);

        expect(stubIndentStyle.called).to.be.true;
        expect(stubIndentSize.called).to.be.true;
        expect(stubEndOfLine.called).to.be.true;
        expect(stubTrimTrailingWhitespace.called).to.be.true;
        expect(stubEndsWithNewLine.called).to.be.true;
    });

    it('Should handle `tab_width` property when `indent_size` is set to `tab`', () => {
        const documentManager = new EditorconfigDocumentManager();

        const stubIndentSize = sinon.stub(documentManager, 'ensureIndentSize').callThrough();
        const stubTabWidth = sinon.stub(documentManager, 'ensureTabWidth');

        const properties = {
            indent_size: 'tab',
            tab_width: 4
        } as KnownProps;

        documentManager.applyProperties(properties, {} as MonacoEditor);

        expect(stubIndentSize.called).to.be.true;
        expect(stubTabWidth.called).to.be.true;
    });

    it('Should skip `tab_width` property when `indent_size` is set to `tab` but `tab_width` is not set', () => {
        const documentManager = new EditorconfigDocumentManager();

        const stubIndentSize = sinon.stub(documentManager, 'ensureIndentSize').callThrough();
        const stubTabWidth = sinon.stub(documentManager, 'ensureTabWidth');

        const properties = {
            indent_size: 'tab'
        } as KnownProps;

        documentManager.applyProperties(properties, {} as MonacoEditor);

        expect(stubIndentSize.called).to.be.true;
        expect(stubTabWidth.called).to.be.false;
    });

    it('Should skip all properties', () => {
        const documentManager = new EditorconfigDocumentManager();

        const stubIndentStyle = sinon.stub(documentManager, 'ensureIndentStyle');
        const stubIndentSize = sinon.stub(documentManager, 'ensureIndentSize');
        const stubEndOfLine = sinon.stub(documentManager, 'ensureEndOfLine');
        const stubTrimTrailingWhitespace = sinon.stub(documentManager, 'ensureTrimTrailingWhitespace');
        const stubEndsWithNewLine = sinon.stub(documentManager, 'ensureEndsWithNewLine');

        const properties = {} as KnownProps;

        documentManager.applyProperties(properties, {} as MonacoEditor);

        expect(stubIndentStyle.called).to.be.false;
        expect(stubIndentSize.called).to.be.false;
        expect(stubEndOfLine.called).to.be.false;
        expect(stubTrimTrailingWhitespace.called).to.be.false;
        expect(stubEndsWithNewLine.called).to.be.false;
    });

});
