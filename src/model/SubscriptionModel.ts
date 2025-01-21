import { PreApprovalPlanRequest, PreApprovalPlanResponse } from 'mercadopago/dist/clients/preApprovalPlan/commonTypes';
import { PreApprovalPlan, PreApproval } from 'mercadopago';
import { client } from '../lib/MercadoPago';
import { PreApprovalResponse } from 'mercadopago/dist/clients/preApproval/commonTypes';
import { PreApprovalCreateData } from 'mercadopago/dist/clients/preApproval/create/types';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export default class SubscriptionModel {
    public static async membershipSubscription(subscriptionPlan: PreApprovalPlanRequest) {
        try {
            const preApprovalPlan: PreApprovalPlan = new PreApprovalPlan(client);
            const response: PreApprovalPlanResponse = await preApprovalPlan.create({ body: subscriptionPlan });
            return response.init_point;
        }
        catch(err) {
            console.log(err);
            throw new Error(err as string);
        }
    }

    public static async monthlySubscription(subscriptionPlan: PreApprovalCreateData) {
        try {
            const approvalPlan: PreApproval = new PreApproval(client);
            const response: PreApprovalResponse = await approvalPlan.create(subscriptionPlan);
            console.log(response);
            return response;
        }
        catch(err) {
            console.log(err);
            throw new Error(err as string);
        }
    }

    public static async getMembershipPaymentURL(course: string, membershipType: string) {
        try {
            const courseQuery = query(collection(db, 'Membership'), where('Course', '==', course));
            const courseSnap = await getDocs(courseQuery);

            if(courseSnap.empty) {
                throw new Error('Curso no encontrado');
            }
            return courseSnap.docs[0].data()[membershipType];
        }
        catch(err) {
            throw new Error(err as string);
        }
    }
}