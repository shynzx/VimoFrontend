import { Request, Response, NextFunction } from 'express';

interface GuideRepository {
  findAll(): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
}

export class GuideResourceController {
  private repository: GuideRepository;
  constructor(repository: GuideRepository) { this.repository = repository; }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.json({ success: true, data: await this.repository.findAll() }); }
    catch (error) { next(error); }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.repository.findById(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Registro no encontrado.' } });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error) { next(error); }
  };
}
