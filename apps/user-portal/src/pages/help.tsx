/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DefaultPageLayout } from "../layouts";
import ReactMarkdown from "react-markdown";

/**
 * Privacy page.
 *
 * @return {ReactElement}
 */
export const HelpPage = (): ReactElement => {
    const { t, i18n } = useTranslation();

    const Image = (props): ReactElement => {
        return <img { ...props } style={ { maxWidth: "70%" } } />
    };

    return (
        <DefaultPageLayout
            pageTitle={ t("views:pages.help.title") }
        >
            <ReactMarkdown
                source={ t("help:content", { lang: i18n.language}) }
                renderers={ {
                    image: Image
                } }
            />
        </DefaultPageLayout>
    );
};
