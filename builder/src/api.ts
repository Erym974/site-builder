import type {Page, Pages, Site, Sites, User} from "./type.ts";
import {type Data} from "@puckeditor/core";
import axios from "./libs/axios.ts";

export const fetchMe = async (): Promise<User> => {
    const response = await axios.get('/api/users/me');
    return response.data;
}

export const fetchSites = async (): Promise<Sites[]> => {
    const response = await axios.get('/api/sites');
    return response.data;
}

export const fetchSite = async (siteSlug: string): Promise<Site> => {
    const response = await axios.get(`/api/sites/${siteSlug}`);
    return response.data;
}

export const createSite = async (siteDto: { name: string }): Promise<Site> => {
    const response = await axios.post(`/api/sites`, siteDto);
    return response.data;
}

export const fetchPage = async (siteSlug: string, pagePath: string, renderMode: "draft" | "live"): Promise<Page> => {
    const response = await axios.get(`/api/sites/${siteSlug}/page?path=${pagePath}&renderMode=${renderMode}`);
    return response.data;
}

export const fetchPages = async (siteSlug: string): Promise<Pages[]> => {
    const response = await axios.get(`/api/sites/${siteSlug}/pages`);
    return response.data;
}

export const updatePuckPage = async ({siteSlug, pageId, mode, data}: {
    siteSlug: string;
    pageId: string;
    mode: "draft" | "live";
    data: Data;
}) => {
    const response = await axios.put(`/api/sites/${siteSlug}/pages/${pageId}/puck`, {mode, data});
    return response.data;
};

export const createPage = async ({siteSlug, data}: {
    siteSlug: string;
    data: {
        parentPath: string;
        name: string;
    };
}) => {
    const response = await axios.post(`/api/sites/${siteSlug}/pages`, data);
    return response.data;
};