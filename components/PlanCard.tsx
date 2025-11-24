import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CalculatedPlan, HealthPlan } from '../types';

interface PlanCardProps {
  variants: CalculatedPlan[];
  compareList: CalculatedPlan[];
  onToggleCompare: (plan: CalculatedPlan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ variants, compareList, onToggleCompare }) => {
  const [showCopartInfo, setShowCopartInfo] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  
  if (!variants || variants.length === 0) return null;

  // Static data comes from the first plan in the group (Name, Operator, Hospitals)
  const basePlan = variants[0].plan;

  const formatMoney = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const renderCopartLabel = (plan: HealthPlan) => {
     switch(plan.coparticipationType) {
        case 'full': 
            return <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">Com Coparticipação</span>;
        case 'partial': 
            return (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                    Sem Copart. <span className="text-[10px] text-blue-400 font-medium uppercase">(Exceto Terapias)</span>
                </span>
            );
        case 'none': 
            return <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Sem Coparticipação</span>;
        default: 
            return <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">Padrão</span>;
     }
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full relative group`}>
        
        {/* Colored Header */}
        <div className={`${basePlan.logoColor} p-4 pt-5 flex justify-between items-start relative rounded-t-xl`}>
            <div className="flex-1 pr-2">
                <p className="text-xs font-bold text-white/80 uppercase tracking-wide mb-0.5">{basePlan.operator}</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-white leading-tight">
                        {basePlan.name}
                    </h3>
                    {/* Moved Badge */}
                    {basePlan.operator.includes('Eva') && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            NOVIDADE
                        </span>
                    )}
                </div>
                
                {/* Specific Styling for Eva Prata */}
                {basePlan.operator.includes('Eva') && basePlan.name.includes('Prata') && (
                    <span className="block text-xs font-normal text-white/90 mt-0.5 tracking-normal">(enfermaria)</span>
                )}
            </div>
            
            {/* View Details Button - Moved to Header */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowPlanDetails(true); }}
              className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-white hover:bg-blue-50 px-3 py-1.5 rounded shadow-sm transition-colors uppercase tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              Ver Detalhes
            </button>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Principais Hospitais:</p>
            <div className="flex flex-wrap gap-1">
              {basePlan.hospitals.map((h, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {h}
                </span>
              ))}
            </div>
          </div>
          
          {/* Copart Info Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowCopartInfo(true); }}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 py-2.5 rounded-lg transition-colors uppercase tracking-wide mt-auto mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500/80">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.539 1.345 1.902 3.56 1.02 5.51-.686 1.52-2.255 2.447-3.232 3.12l-.052.036c-.906.62-2.055 1.407-2.055 2.88a.75.75 0 0 1-1.5 0c0-2.247 1.477-3.395 2.615-4.173l.052-.036c.888-.607 1.915-1.309 2.305-2.174.464-1.025.271-2.167-.537-2.874Z" clipRule="evenodd" />
              <path d="M12 18.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
            </svg>
            Entenda o que é coparticipação
          </button>
        </div>

        {/* Variants List Section */}
        <div className="bg-gray-50 border-t border-gray-100 rounded-b-xl flex flex-col">
           {variants.map((v, idx) => {
             // Check if this specific variant is in the comparison list
             const isSelectedForCompare = compareList.some(p => p.plan.id === v.plan.id && p.totalPrice === v.totalPrice);
             
             return (
               <div key={v.plan.id} className={`p-4 ${idx > 0 ? 'border-t border-gray-200' : ''}`}>
                 
                 {/* Header for this Variant */}
                 <div className="mb-3 flex justify-between items-center">
                    {renderCopartLabel(v.plan)}
                 </div>

                 {/* Price */}
                 <div className="flex justify-between items-end mb-3">
                    <span className="text-xs text-gray-500 font-medium mb-1">Total Mensal</span>
                    <span className="text-2xl font-bold text-blue-900 block leading-none tracking-tight">
                        {formatMoney(v.totalPrice)}
                    </span>
                 </div>

                 {/* Breakdown */}
                 <div className="bg-white rounded border border-gray-100 p-2.5 mb-3">
                    <div className="space-y-1.5">
                      {v.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex justify-between items-center text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <span className="bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded text-[10px]">{detail.count}x</span>
                                <span>{detail.ageRange} anos</span>
                            </div>
                            <span className="font-mono text-gray-800 font-medium">{formatMoney(detail.subtotal)}</span>
                          </div>
                      ))}
                    </div>
                 </div>

                 {/* Compare Button for this specific variant */}
                 <div className="flex justify-end">
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(v);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                            ${isSelectedForCompare 
                                ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300' 
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                            }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors
                            ${isSelectedForCompare ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}
                        `}>
                            {isSelectedForCompare && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-white">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        Comparar
                      </button>
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Coparticipation Explanation Modal - Using Portal */}
      {showCopartInfo && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setShowCopartInfo(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowCopartInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Entenda a Coparticipação
            </h3>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed overflow-y-auto pr-1">
              <p>
                👉 <span className="font-bold">Coparticipação</span> é quando o beneficiário paga um valor simbólico apenas quando usa o plano, como em consultas, exames ou terapias.
              </p>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <p className="font-bold text-purple-900 mb-1">🔹 Sem Coparticipação (exceto em terapias)</p>
                <p>A cobrança acontece somente em terapias, como psicologia, fonoaudiologia e fisioterapia. Já as consultas, exames e demais atendimentos não têm custo extra — são totalmente cobertos pelo plano.</p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <p className="font-bold text-orange-900 mb-1">🔸 Com Coparticipação</p>
                <p>Nesse modelo, há cobrança toda vez que o plano é utilizado, seja em consultas, exames ou terapias. A mensalidade é mais baixa, mas o beneficiário participa mais nos custos quando usa o plano.</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 mb-1">✨ Resumindo:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="font-semibold">Sem Coparticipação:</span> paga apenas em terapias.</li>
                  <li><span className="font-semibold">Com Coparticipação:</span> paga em todos os serviços utilizados.</li>
                </ul>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCopartInfo(false)}
              className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              Entendi
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Plan Details Modal - Using Portal */}
      {showPlanDetails && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowPlanDetails(false)}>
           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] animate-slideUp" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className={`${basePlan.logoColor} p-6 rounded-t-2xl border-b border-white/10 flex justify-between items-center flex-shrink-0`}>
                 <div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wide">{basePlan.operator}</p>
                    <h3 className="text-2xl font-bold text-white">{basePlan.name}</h3>
                 </div>
                 <button onClick={() => setShowPlanDetails(false)} className="text-white/70 hover:text-white p-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 
                 {/* Abrangência */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                       </svg>
                       Abrangência Geográfica
                    </h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {basePlan.coverage}
                    </p>
                 </div>

                 {/* Carência */}
                 <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                       </svg>
                       Carências (Estimadas)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                       {basePlan.gracePeriods.map((gp, i) => (
                          <li key={i} className="flex items-start gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                             <span>{gp}</span>
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* Tabela Copart */}
                 <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                       </svg>
                       Tabelas de Coparticipação
                    </h4>
                    
                    {variants.map((v, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                <span className="text-xs font-bold text-gray-600 uppercase">
                                    {v.plan.coparticipationType === 'none' ? 'Sem Coparticipação' : 
                                     v.plan.coparticipationType === 'partial' ? 'Sem Copart. (Exceto Terapias)' : 
                                     'Com Coparticipação'}
                                </span>
                            </div>

                            {v.plan.coparticipationType !== 'none' ? (
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-white text-gray-700 font-bold border-b border-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-xs">Serviço</th>
                                        <th className="px-3 py-2 text-xs">Valor</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {v.plan.copayFees.map((fee, i) => (
                                        <tr key={i} className="bg-white">
                                            <td className="px-3 py-2 text-gray-600 text-xs">{fee.service}</td>
                                            <td className="px-3 py-2 font-medium text-gray-800 text-xs">{fee.value}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-green-700 font-bold text-sm">Este plano não possui coparticipação.</p>
                                    <p className="text-green-600 text-xs">Uso livre sem taxas adicionais.</p>
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
                 
                 <p className="text-[10px] text-gray-400 italic text-center mt-4">
                   * Os valores e condições podem sofrer alterações sem aviso prévio. Consulte o contrato final.
                 </p>
              </div>
              
              {/* Footer Action */}
              <div className="p-6 border-t border-gray-100 flex-shrink-0">
                <button 
                  onClick={() => setShowPlanDetails(false)}
                  className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Fechar
                </button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </>
  );
};