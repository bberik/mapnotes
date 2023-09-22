import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import { baseUrl } from '../../app/api/apiSlice'

export const EDITOR_JS_TOOLS = {
    inlineToolbar: true,
    embed: Embed,
    table: Table,
    list: List,
    warning: Warning,
    code: Code,
    image: {
        class: Image,
        config: {
            endpoints: {
                byFile: `${baseUrl}/api/uploadimage`
            }
        }
    },
    raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
}