import { Injectable, Logger, NotFoundException, OnModuleInit, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  // PrismaClient hace referencia al schema.prisma, a los modelos creados

  private readonly logger = new Logger('ProductsService');

  // Esto es para inicializar la base de datos con Prisma
  onModuleInit() {
    this.$connect()
    this.logger.log('Database connected')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    })
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const total = await this.product.count({ where: {available: true} });
    const lastPage = Math.ceil(total / limit);

    return {
      meta: {
        total,
        page,
        lastPage,
      },
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      })
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto; // Haciendo esto para asegurarnos de no enviar el id en el update

    await this.findOne(id)

    return this.product.update({
      where: {id},
      data: data,
    })
  }

  async remove(id: number) {
    await this.findOne(id)

    // Si fuera eliminación física:
    // return this.product.delete({
    //   where: {id},
    // })

    // Eliminación lógica:
    return this.product.update({
      where: { id },
      data: {
        available: false
      },
    });

  }
}
