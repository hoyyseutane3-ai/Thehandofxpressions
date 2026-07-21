const pricing = {
            A4: { bw: 480, col: 580, bwEx: 540, colEx: 680 },
            A3: { bw: 680, col: 780, bwEx: 740, colEx: 880 },
            A2: { bw: 1400, col: 1700, bwEx: 1800, colEx: 2000 },
            A1: { bw: 2700, col: 2900, bwEx: 3100, colEx: 3400 }
        };

        let order = { 
            size: '', 
            style: 'bw', 
            isExtra: false, 
            hasTimelapse: false, 
            delivery: 'collect' 
        };

        function toggleMenu() {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        }

        function showCustomToast(msg) {
            const toast = document.getElementById('customToast');
            document.getElementById('toastMsg').textContent = msg;
            toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
            }, 3500);
        }

        function openOrder(s) {
            order = { 
                size: s, 
                style: 'bw', 
                isExtra: false, 
                hasTimelapse: false, 
                delivery: 'collect' 
            };
            
            document.getElementById('modalTitle').textContent = s + " Commission Setup";
            updateOrderUI();
            document.getElementById('orderModal').classList.add('show');
        }

        function closeOrder() { 
            document.getElementById('orderModal').classList.remove('show'); 
        }
        
        function setStyle(s) { 
            order.style = s; 
            updateOrderUI(); 
        }
        
        function toggleComplexity() { 
            order.isExtra = !order.isExtra; 
            updateOrderUI(); 
        }
        
        function toggleTimelapse() { 
            order.hasTimelapse = !order.hasTimelapse; 
            updateOrderUI(); 
        }
        
        function setDelivery(d) { 
            order.delivery = d; 
            updateOrderUI(); 
        }

        function updateOrderUI() {
            const sizeData = pricing[order.size];
            if (!sizeData) return;

            const isBW = order.style === 'bw';
            document.getElementById('btnBW').className = `py-3 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${isBW ? 'border-[#d4af6a] bg-[#d4af6a] text-stone-950 shadow-[0_0_15px_rgba(212,175,106,0.2)]' : 'border-stone-800 bg-stone-900 text-stone-400'}`;
            document.getElementById('btnColor').className = `py-3 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${!isBW ? 'border-[#d4af6a] bg-[#d4af6a] text-stone-950 shadow-[0_0_15px_rgba(212,175,106,0.2)]' : 'border-stone-800 bg-stone-900 text-stone-400'}`;

            document.getElementById('btnComplexity').className = `py-3 px-4 rounded-xl font-bold border-2 text-left flex justify-between items-center transition-all ${order.isExtra ? 'border-[#d4af6a] bg-stone-900 text-white' : 'border-stone-800 bg-stone-900 text-stone-400'}`;
            document.getElementById('badgeComplexity').textContent = order.isExtra ? "Multiple/Complex" : "Standard";
            document.getElementById('badgeComplexity').className = `text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${order.isExtra ? 'bg-[#d4af6a] text-stone-950' : 'bg-stone-800 text-stone-300'}`;

            document.getElementById('btnTimelapse').className = `py-3 px-4 rounded-xl font-bold border-2 text-left flex justify-between items-center transition-all ${order.hasTimelapse ? 'border-[#d4af6a] bg-stone-900 text-white' : 'border-stone-800 bg-stone-900 text-stone-400'}`;
            document.getElementById('badgeTimelapse').className = `text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${order.hasTimelapse ? 'bg-[#d4af6a] text-stone-950' : 'bg-stone-800 text-stone-300'}`;

            const isCollect = order.delivery === 'collect';
            document.getElementById('btnCollect').className = `py-3 rounded-xl font-bold border-2 transition-all text-xs uppercase tracking-wider ${isCollect ? 'border-[#d4af6a] bg-[#d4af6a] text-stone-950' : 'border-stone-800 bg-stone-900 text-stone-400'}`;
            document.getElementById('btnShipping').className = `py-3 rounded-xl font-bold border-2 transition-all text-xs uppercase tracking-wider ${!isCollect ? 'border-[#d4af6a] bg-[#d4af6a] text-stone-950' : 'border-stone-800 bg-stone-900 text-stone-400'}`;

            let base = 0;
            if (isBW) {
                base = order.isExtra ? sizeData.bwEx : sizeData.bw;
            } else {
                base = order.isExtra ? sizeData.colEx : sizeData.col;
            }

            const deliveryCost = order.delivery === 'shipping' ? 100 : 0;
            const timelapseCost = order.hasTimelapse ? 50 : 0;

            const finalTotal = base + deliveryCost + timelapseCost;
            document.getElementById('totalDisplay').textContent = "R" + finalTotal;

            const desc = `${order.size} | ${isBW ? 'B&W' : 'Color'} | ${order.isExtra ? 'Complex' : '1 Subject'} ${order.hasTimelapse ? '+ Video' : ''}`;
            document.getElementById('invoiceDetails').textContent = desc;
        }

        async function submitEmail() {
            const n = document.getElementById('custName').value.trim();
            const e = document.getElementById('custEmail').value.trim();
            if(!n || !e) {
                showCustomToast("Please enter both your Name and Email Address.");
                return;
            }
            
            const total = document.getElementById('totalDisplay').textContent;
            const styleLabel = order.style === 'bw' ? 'B&W' : 'Color';
            const complexityLabel = order.isExtra ? 'Multiple Subjects / Complex Artwork' : 'Single Subject';
            const timelapseLabel = order.hasTimelapse ? 'Yes' : 'No';
            const deliveryLabel = order.delivery === 'collect' ? 'Pretoria Pickup' : 'PostNet Shipping (+R100)';

            const orderDetails = {
                Customer: n,
                Email: e,
                Size: order.size,
                Style: styleLabel,
                Subjects: complexityLabel,
                TimelapseVideo: timelapseLabel,
                Delivery: deliveryLabel,
                GrandTotal: total
            };

            try {
                await fetch("https://formspree.io/f/myklqqld", { 
                    method: "POST", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(orderDetails) 
                });
                showCustomToast("E-mail order sent! Thank you.");
                closeOrder();
            } catch (err) {
                showCustomToast("Form submission error. Please use WhatsApp fallback.");
            }
        }

        function submitWhatsApp() {
            const n = document.getElementById('custName').value.trim();
            if(!n) {
                showCustomToast("Please enter your Full Name.");
                return;
            }
            
            const total = document.getElementById('totalDisplay').textContent;
            const styleLabel = order.style === 'bw' ? 'B&W' : 'Color';
            const complexityLabel = order.isExtra ? 'Multiple Subjects / Complex Artwork' : 'Single Subject';
            const timelapseLabel = order.hasTimelapse ? 'Yes' : 'No';
            const deliveryLabel = order.delivery === 'collect' ? 'Pretoria Pickup' : 'PostNet Shipping (+R100)';

            const msg = `*NEW COMMISSION ORDER — Bantse's Pencil*%0A` +
                        `*Customer Name:* ${encodeURIComponent(n)}%0A` +
                        `*Size:* ${encodeURIComponent(order.size)}%0A` +
                        `*Style:* ${encodeURIComponent(styleLabel)}%0A` +
                        `*Subjects:* ${encodeURIComponent(complexityLabel)}%0A` +
                        `*Timelapse Video:* ${encodeURIComponent(timelapseLabel)}%0A` +
                        `*Delivery:* ${encodeURIComponent(deliveryLabel)}%0A` +
                        `*Grand Total:* ${encodeURIComponent(total)}`;

            window.open(`https://wa.me/27693944083?text=${msg}`, '_blank');
        }

        // LAZY REVEAL OBSERVER SETUP
        function initLazyReveal() {
            const options = {
                root: null,
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px"
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Custom lazy timed stagger delay
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            document.querySelectorAll('.lazy-reveal').forEach(el => {
                revealObserver.observe(el);
            });
        }

        window.addEventListener('load', () => {
            document.getElementById('year').textContent = new Date().getFullYear();
            if (window.lucide) {
                window.lucide.createIcons();
            }

            // Initialize lazy transitions
            initLazyReveal();

            const checkFB = setInterval(async () => {
                if (window.fb) {
                    clearInterval(checkFB);
                    const { auth, db, appId, onSnapshot, collection, query, signInAnonymously } = window.fb;
                    await signInAnonymously(auth);
                    
                    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'comments')), s => {
                        const chats = s.docs.map(d => d.data()).sort((a,b) => a.createdAt - b.createdAt);
                        document.getElementById('chatBox').innerHTML = chats.map(c => `
                            <div class="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-sm self-start max-w-[85%]">
                                <p class="text-[9px] font-black text-[#d4af6a] uppercase tracking-widest mb-1">${c.author || 'Visitor'}</p>
                                <p class="text-xs font-bold text-stone-200 leading-relaxed">${c.text}</p>
                            </div>
                        `).join('');
                        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
                    });
                }
            }, 100);
        });

        async function postChat(e) {
            e.preventDefault();
            const t = document.getElementById('chatMsg').value.trim();
            if(!t) return;
            const { db, appId, collection, addDoc, serverTimestamp } = window.fb;
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'comments'), { 
                text: t, 
                createdAt: serverTimestamp(), 
                author: localStorage.getItem('bantseName') || 'Visitor' 
            });
            document.getElementById('chatMsg').value = '';
        }

        document.getElementById('fileInput').addEventListener('change', function() {
            if(this.files.length) {
                const reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onload = async e => {
                    const { db, appId, collection, addDoc, serverTimestamp } = window.fb;
                    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gallery_cloud'), { 
                        url: e.target.result, 
                        createdAt: serverTimestamp() 
                    });
                    showCustomToast("Portrait shared! Check gallery page.");
                }
            }
        });