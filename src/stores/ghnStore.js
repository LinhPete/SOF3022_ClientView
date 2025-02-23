import { defineStore } from "pinia";
import axiosInstance from "../axios/asios";

export const useGHNStore = defineStore("ghn", {
  state: () => ({
    provinces: [],
    districts: [],
    wards: [],
    shippingMethods: [],
    shippingFee: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProvinces() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get("/store/shipping/provinces");
        this.provinces = response.data.result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDistricts(districtRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post(
          "/store/shipping/districts",
          districtRequest
        );
        this.districts = response.data.result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchWards(wardRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post(
          "/store/shipping/wards",
          wardRequest
        );
        this.wards = response.data.result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchShippingMethods(to_district) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post(
          "/store/shipping/methods",
          to_district
        );
        this.shippingMethods = response.data.result;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchShippingFee(feeRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post(
          "/store/shipping/fee",
          feeRequest
        );
        this.shippingFee = response.data.result.total;
        return response.data.result.total;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
