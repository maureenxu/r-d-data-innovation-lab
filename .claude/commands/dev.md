Start both the backend and frontend development servers for Persona Lab.

## Steps

1. Check that `persona-lab/backend/venv` exists. If not, create it:
   ```bash
   cd persona-lab/backend && python -m venv venv
   ```

2. Start the FastAPI backend in the background:
   ```bash
   cd persona-lab/backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
   ```

3. Start the Next.js frontend in the background:
   ```bash
   cd persona-lab/frontend && npm run dev
   ```

4. Verify both are up:
   - Backend health: `curl -s http://localhost:8000/health`
   - Frontend: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`

5. Report which processes are running and their ports. If either fails to start, show the error output.

## Ports
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
