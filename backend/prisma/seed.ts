import bcrypt from "bcrypt";
import { PrismaClient, Role, RiskLevel } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash("Victim@123", 12);
  const victim = await prisma.user.upsert({ where:{email:"victim@tracechain.demo"}, update:{}, create:{email:"victim@tracechain.demo",name:"Priya Sharma",passwordHash,role:Role.VICTIM} });
  const investigator = await prisma.user.upsert({ where:{email:"investigator@tracechain.demo"}, update:{}, create:{email:"investigator@tracechain.demo",name:"A. Verma",passwordHash:await bcrypt.hash("Investigator@123",12),role:Role.INVESTIGATOR} });
  await prisma.user.upsert({ where:{email:"admin@tracechain.demo"}, update:{}, create:{email:"admin@tracechain.demo",name:"System Administrator",passwordHash:await bcrypt.hash("Admin@123",12),role:Role.ADMIN} });
  const vasp = await prisma.vASP.upsert({ where:{id:"demo-exchange-alpha"}, update:{}, create:{id:"demo-exchange-alpha",name:"Demo Exchange Alpha",type:"Centralized Exchange",country:"Synthetic",attributionSource:"Synthetic demo dataset",verified:false,confidence:94} });
  await prisma.vASPWallet.upsert({ where:{blockchain_walletAddress:{blockchain:"Ethereum",walletAddress:"0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"}}, update:{}, create:{vaspId:vasp.id,blockchain:"Ethereum",walletAddress:"0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",label:"Demo Exchange Alpha Deposit",walletType:"Exchange deposit",confidence:94,source:"Synthetic demo dataset",verified:false} });
  const complaint = await prisma.complaint.upsert({ where:{caseId:"TCIN-DEMO-001"}, update:{}, create:{caseId:"TCIN-DEMO-001",fraudType:"Investment Scam",description:"Synthetic demonstration complaint.",blockchain:"Ethereum",suspectWallet:"0x1111111111111111111111111111111111111111",victimId:victim.id,currency:"ETH",amount:2.84} });
  const investigation = await prisma.investigation.upsert({ where:{complaintId:complaint.id}, update:{}, create:{complaintId:complaint.id,investigatorId:investigator.id,status:"VASP_IDENTIFIED",dataMode:"DEMO"} });
  const assessment = await prisma.riskAssessment.upsert({ where:{investigationId:investigation.id}, update:{score:92,riskLevel:RiskLevel.CRITICAL}, create:{investigationId:investigation.id,score:92,riskLevel:RiskLevel.CRITICAL} });
  await prisma.riskSignal.deleteMany({ where:{assessmentId:assessment.id} });
  await prisma.riskSignal.createMany({ data:[{assessmentId:assessment.id,name:"Rapid fund movement",score:20,evidence:"Synthetic transfers inside 8 minutes.",severity:RiskLevel.HIGH},{assessmentId:assessment.id,name:"Layering",score:20,evidence:"Two synthetic intermediary hops.",severity:RiskLevel.CRITICAL},{assessmentId:assessment.id,name:"High-value transfer",score:10,evidence:"Synthetic 2.84 ETH transfer.",severity:RiskLevel.HIGH}] });
  console.log("TRACECHAIN-IN demo users and TCIN-DEMO-001 seeded.");
}
main().finally(() => prisma.$disconnect());
